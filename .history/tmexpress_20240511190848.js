const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const fsExtra = require('fs-extra')
const app = express()
const util = require('util')

const setTimeoutPromise = util.promisify(setTimeout)
const sqlite3 = require('sqlite3').verbose() // Setup multer to store files temporarily in a staging area
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '/temp/')) // Temporary storage for processing
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname) // Maintain original file name during processing
	},
})
function resizeAndCropImage(inputPath, outputPath) {
	// Check if inputPath is the same as outputPath
	//console.log('INP: ', inputPath, 'OUT: ', outputPath)
	if (inputPath === outputPath) {
		console.log('INP: ', inputPath, 'OUT: ', outputPath)
		return Promise.reject(new Error('Input path cannot be the same as the output path'))
	}
	// Ensure outputPath ends with '.jpg'
	if (!outputPath.endsWith('.jpg')) {
		outputPath += '.jpg' // Append '.jpg' if it's not already present
	}
	return sharp(inputPath)
		.resize(1024, 1024, { fit: 'cover' })
		.toFormat('jpeg') // Convert image to JPEG format
		.toFile(outputPath)

		.then((info) => {
			//console.log('Image resized and cropped successfully:', info)

			return outputPath // Return the outputPath to use it later if needed
		})
		.catch((err) => {
			console.error('Error resizing and cropping image:', err)

			throw err // Rethrow the error to handle it in the catch block of the Promise chain
		})
}
function getImageCountForCar(make, model, vin) {
	const dir = path.join(__dirname, 'assets/img/vehicles', `${make}_${model}_${vin}`)
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			if (err) {
				reject(err) // Error reading the directory
			} else {
				let maxIndex = -1
				files.forEach((file) => {
					const match = file.match(/image(\d+)\.jpg$/)
					if (match) {
						const index = parseInt(match[1], 10)
						if (index > maxIndex) {
							maxIndex = index
						}
					}
				})
				resolve(maxIndex + 1) // +1 because indices start at 0
			}
		})
	})
}
const upload = multer({ storage: storage })
// Create a new SQLite database connection
const db = new sqlite3.Database('vehdatabase.sqlite', (err) => {
	if (err) {
		console.error('Error opening database', err.message)
	} else {
		console.log('Connected to the SQLite database')
	}
})

// Create a table in the database
db.run(
	`CREATE TABLE IF NOT EXISTS vehDB (
	make TEXT,
    model TEXT,
    year INTEGER,
    price INTEGER,
    vin TEXT,
    engine TEXT,
    transmission TEXT,
    drive TEXT,
    mileage INTEGER,
    exterior TEXT,
    interior TEXT,
    fuelEconomy TEXT,
    features TEXT,
    comments TEXT,
    img TEXT,
    PRIMARY KEY (make, model, vin)
)`,
	(err) => {
		if (err) {
			console.error('Error creating table', err.message)
		} else {
			console.log('Table created successfully')
		}
	}
)

app.set('view engine', 'ejs')
app.set('views', './')
app.use(
	cors({
		origin: '*', // Or use '*' to allow all origins
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods as per your requirements
		allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers as per your requirements
	})
)
// Set the view engine to EJS

app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
	req.ind = 0 // Initialize req.ind

	next()
})

app.post('/upload', upload.array('images'), async (req, res) => {
	console.log('Upload request received')
	console.log('Request body:', req.body)
	console.log('Request files:', req.files)
	req.ind = 0 // Reset the index for each new submission
	//console.log('CUR FILES: ', req.files)
	try {
		const {
			make,
			model,
			year,
			price,
			mileage,
			engine,
			transmission,
			drive,
			exterior,
			interior,
			fuelEconomy,
			features,
			comments,
			vin,
		} = req.body
		// Define dir here

		const dir = path.join(__dirname, '/assets/img/vehicles/', `${make}_${model}_${vin}`)
		// Ensure the target directory exists
		await fs.promises.mkdir(dir, { recursive: true })

		//console.log('UPLOADED: ', orderedFiles) // This will log the array of uploaded files in the correct order

		const files = req.files
		// Process and move files
		for (const file of files) {
			try {
				const inputPath = file.path
				const outputPath = path.join(dir, file.originalname)

				// Resize and crop image
				await sharp(inputPath)
					.resize(1024, 1024, { fit: 'cover' })
					.jpeg({ quality: 90 })
					.toFile(outputPath)

				// Attempt to delete the temporary file with retries
				//await retryDelete(inputPath, 3)
			} catch (err) {
				console.error('Error processing file:', file.originalname, err)
			}
		}
		// Log the original file paths of all uploaded images
		/*console.log(
			'ORIGINAL FILE PATHS:',
			uniqueFiles.map((file) => file.path)
		)*/

		// Process images and move them after processing
		const processedFiles = await Promise.all(
			uniqueFiles.map(async (file) => {
				const inputPath = file.path
				const outputPath = path.join(dir, file.originalname)

				// Resize and crop image
				await sharp(inputPath)
					.resize(1024, 1024, { fit: 'cover' })
					.jpeg({ quality: 90 })
					.toFile(outputPath)

				// Delete the original file from temp after processing
				//await fs.promises.unlink(inputPath)

				return outputPath
			})
		)
		fsExtra.emptyDirSync(path.join(__dirname, '/temp/'))
		const img = []

		req.files.forEach((file) => {
			if (!uniqueFiles.find((uniqueFile) => uniqueFile.path === file.path)) {
				fs.unlink(file.path, (err) => {
					if (err) {
						console.error('Failed to delete duplicate file', err)
					} else {
						console.log('Duplicate file deleted successfully')
					}
				})
			}
		})
		//console.log('Files:', uniqueFiles) //
		// Map the files to their new paths using the sorted order
		/*uniqueFiles.forEach((file, index) => {
			const extension = path.extname(file.originalname)
			const newFilename = `${make}_${model}_${vin}_${index}${extension}`
			const newPath = path.join(dir, newFilename)
			fs.rename(file.path, newPath, (err) => {
				if (err) {
					console.error('Failed to move file', err)
				} else {
					console.log('File moved successfully')
					img.push(newPath)
					console.log('CUR IMG: ', img.toString())
				}
			})
			++req.ind
		})*/
		const imgPath = img.join(',')
		db.serialize(() => {
			console.log('Preparing to insert data into the cars table')

			// Ensure that your variables make, model, year, price, etc. are defined with correct values here
			console.log(
				'Data to be inserted:',
				make,
				model,
				year,
				price,
				mileage,
				engine,
				transmission,
				drive,
				exterior,
				interior,
				fuelEconomy,
				features,
				comments,
				vin,
				imgPath
			)

			const stmt = db.prepare(`INSERT INTO vehDB (
        make, model, year, price, mileage, engine, transmission, drive, exterior, interior, fuelEconomy, features, comments, vin, img
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

			stmt.run(
				make,
				model,
				year,
				price,
				mileage,
				engine,
				transmission,
				drive,
				exterior,
				interior,
				fuelEconomy,
				features,
				comments,
				vin,
				imgPath
			)

			stmt.finalize()

			console.log('Data inserted into the cars table successfully')

			db.close()
		})

		res.json({ message: 'Data inserted into SQLite database' })
	} catch (err) {
		console.error(err)
		res.status(500).send('An error occurred on the server.')
	}
})

app.get('/listings', (req, res) => {
	// Connect to your SQLite database and fetch listings
	// Respond with JSON data

	db.all('SELECT * FROM vehDB', [], (err, rows) => {
		if (err) {
			res.status(500).send('An error occurred on the server.')
			throw err
		}
		res.json({ cars: rows })

		//console.log(res.json.toString())
	})
})
// tmexpress.js: Route to handle individual car details
app.get('/cars/:make/:model/:vin', (req, res) => {
	// Extract make, model, and vin from the request parameters
	const { make, model, vin } = req.params

	// Query the database for the specific car details using the make, model, and vin
	db.get(
		'SELECT * FROM vehDB WHERE make = ? AND model = ? AND vin = ?',
		[make, model, vin],
		(err, row) => {
			if (err) {
				// Handle database errors
				res.status(500).send('An error occurred on the server.')
				console.error(err)
			} else if (row) {
				getImageCountForCar(make, model, vin)
					.then((numberOfImages) => {
						const basePath = `/assets/img/vehicles/${make}_${model}_${vin}/`
						const imageUrls = []
						for (let i = 0; i < numberOfImages; i++) {
							imageUrls.push(`${basePath}image${i}.jpg`)
						}
						// Render the EJS page with the car data and the image URLs
						res.render('product', {
							year: row.year,
							make: row.make,
							model: row.model,
							price: row.price,
							mileage: row.mileage,
							engine: row.engine,
							transmission: row.transmission,
							drive: row.drive,
							exterior: row.exterior,
							interior: row.interior,
							fuelEconomy: row.fuelEconomy,
							features: row.features,
							comments: row.comments,
							vin: row.vin,
							img: imageUrls, // Make sure to use the correct property in EJS
						})
					})
					.catch((error) => {
						console.error('Error getting image count:', error)
						res.status(500).send('An error occurred while fetching images.')
					})
			} else {
				// Handle case when no car is found
				res.status(404).send('Car not found')
			}
		}
	)
})
// Function to retry file deletion
async function retryDelete(filePath, attempts) {
	for (let i = 0; i < attempts; i++) {
		try {
			await fs.promises.unlink(filePath)

			break // Exit the loop if deletion was successful
		} catch (error) {
			console.error('Failed to delete file:', filePath, `Attempt ${i + 1}`)
			if (i < attempts - 1) await wait(1000) // wait for 1 second before retrying
			else throw error // throw error after final attempt
		}
	}
}

// Function to wait for a specified time
function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
