const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

const sqlite3 = require('sqlite3').verbose()
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const { make, model, vin } = req.body
		const dir = path.join(__dirname, '/assets/img/vehicles/', `${make}_${model}_${vin}`)

		fs.mkdir(dir, { recursive: true }, (err) => {
			if (err) {
				console.error('Failed to create directory', err)
				cb(err)
			} else {
				cb(null, dir)
			}
		})
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname) // Use the original filename, as it has already been renamed on the client side
	},
})

// Function to ensure the directory exists
function ensureDirectoryExists(filePath) {
	const dirname = path.dirname(filePath)
	if (fs.existsSync(dirname)) {
		return true
	}
	ensureDirectoryExists(dirname)
	fs.mkdirSync(dirname)
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

app.use(cors())
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
		const orderedFiles = req.files.sort((a, b) => {
			const indexA = parseInt(Object.keys(req.body).find((key) => req.body[key] === a.filename))
			const indexB = parseInt(Object.keys(req.body).find((key) => req.body[key] === b.filename))
			return indexA - indexB
		})

		console.log('UPLOADED: ', orderedFiles) // This will log the array of uploaded files in the correct order

		const uniqueFiles = Array.from(new Set(req.files.map((file) => file.originalname))).map(
			(name) => {
				return req.files.find((file) => file.originalname === name)
			}
		)
		// Log the original file paths of all uploaded images
		console.log(
			'ORIGINAL FILE PATHS:',
			uniqueFiles.map((file) => file.path)
		)

		const imageProcessingPromises = uniqueFiles.map((file, index) => {
			const inputPath = file.path
			const originalFileName = path.basename(file.path) // Get the original file name
			const dummySuffix = '_dummy' // Add a dummy suffix
			const suffixedFileName = `${originalFileName.split('.')[0]}${dummySuffix}.${path.extname(
				originalFileName
			)}` // Add dummy suffix to the original file name
			const suffixedFilePath = path.join(path.dirname(file.path), suffixedFileName) // Create path with the suffixed file name
			const outputPath = file.path // Use the original file path for resizing

			return fs.rename(inputPath, suffixedFilePath, (err) => {
				if (err) {
					console.error('Error renaming original file with suffix:', err)
				} else {
					console.log('Original file renamed with suffix:', suffixedFilePath)
					return resizeAndCropImage(suffixedFilePath, outputPath).then(() => {
						fs.unlink(suffixedFilePath, (err) => {
							if (err) {
								console.error('Error removing suffixed file:', err)
							} else {
								console.log('Suffixed file removed:', suffixedFilePath)
							}
						})
						return outputPath
					})
				}
			})
		})

		// Wait for all images to be processed
		const processedImages = await Promise.all(imageProcessingPromises)

		// Define orderIndex based on the orderNumber of each image
		const orderIndex = uniqueFiles.map((file, index) => {
			const orderNumber = index + 1
			return `${make}_${model}_${vin}_${orderNumber}.${path.extname(file.originalname)}`
		})
		// Sort the uniqueFiles array based on the orderIndex
		uniqueFiles.sort(
			(a, b) => orderIndex.indexOf(a.originalname) - orderIndex.indexOf(b.originalname)
		)
		console.log('SORTED: ', uniqueFiles)
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
		console.log('Files:', uniqueFiles) //
		// Map the files to their new paths using the sorted order
		uniqueFiles.forEach((file, index) => {
			const extension = path.extname(file.originalname)
			const newFilename = `${make}_${model}_${vin}_${index}${extension}`
			const newPath = path.join(dir, newFilename)
			fs.rename(file.path, newPath, (err) => {
				if (err) {
					console.error('Failed to move file', err)
				} else {
					console.log('File moved successfully')
				}
			})
			++req.ind
		})
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
				vin
			)

			// Create the table if it doesn't exist
			db.run(`CREATE TABLE IF NOT EXISTS vehDB (
        id INTEGER PRIMARY KEY,
        make TEXT,
        model TEXT,
        year INTEGER,
        price INTEGER,
        mileage INTEGER,
        engine TEXT,
        transmission TEXT,
        drive TEXT,
        exterior TEXT,
        interior TEXT,
        fuelEconomy TEXT,
        features TEXT,
        comments TEXT,
        vin TEXT
    )`)

			const stmt = db.prepare(`INSERT INTO vehDB (
        make, model, year, price, mileage, engine, transmission, drive, exterior, interior, fuelEconomy, features, comments, vin
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
				vin
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
// Modify the resizeAndCropImage function to return a Promise
// Modify the resizeAndCropImage function to return a Promise
function resizeAndCropImage(inputPath, outputPath) {
	// Check if inputPath is the same as outputPath
	if (inputPath === outputPath) {
		console.log('INP: ', inputPath, 'OUT: ', outputPath)
		return Promise.reject(new Error('Input path cannot be the same as the output path'))
	}

	return sharp(inputPath)
		.resize(1024, 1024, { fit: 'cover' })
		.toFile(outputPath)
		.then((info) => {
			console.log('Image resized and cropped successfully:', info)
			resolve(outputPath) // Return the outputPath to use it later if needed
			return outputPath // Return the outputPath to use it later if needed
		})
		.catch((err) => {
			console.error('Error resizing and cropping image:', err)
			reject(err) // Reject the promise with the error
			throw err // Rethrow the error to handle it in the catch block of the Promise chain
		})
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
