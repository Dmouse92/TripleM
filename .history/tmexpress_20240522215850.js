const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const fsExtra = require('fs-extra')
const app = express()
const util = require('util')
const pendingDeletions = []
const bodyParser = require('body-parser')
const setTimeoutPromise = util.promisify(setTimeout)
const betterSqlite3 = require('better-sqlite3')
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '/temp/')) // Temporary storage for processing
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname) // Maintain original file name during processing
	},
})
// Routes
const indexRouter = require('./routes/index')
const jsonloaderRouter = require('./routes/jsonloader')
const vehiclesRouter = require('./routes/vehicles')

function scheduleFileDeletion(filePath, delay = 5000) {
	console.log(`Scheduling deletion for ${filePath} after ${delay}ms`)
	setTimeout(async () => {
		try {
			await fsExtra.emptyDirSync(filePath)
			console.log('Delayed file deleted successfully:', filePath)
		} catch (error) {
			console.error('Failed to delete file in delayed schedule:', filePath, error)
		}
	}, delay)
}
const upload = multer({ storage: storage })
// Create a new SQLite database connection
const db = betterSqlite3(path.join(__dirname, 'vehdatabase.sqlite'), (err) => {
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
// Use routes
app.use('/', indexRouter)
app.use('/jsonloader', jsonloaderRouter)
app.use('/vehicles', vehiclesRouter)

app.set('view engine', 'ejs')
app.set('views', './')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
	cors({
		origin: '*', // Or use '*' to allow all origins
		methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add other methods as per your requirements
		allowedHeaders: ['Content-Type', 'Authorization'], // Add other headers as per your requirements
	})
)
// Set the view engine to EJS
// Static files
app.use(express.static(path.join(__dirname, 'public')))
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
		//scheduleFileDeletion(path.join(__dirname, '/temp/'), 10000) // Delayed cleanup of temp directory

		// Log the original file paths of all uploaded images
		/*console.log(
			'ORIGINAL FILE PATHS:',
			uniqueFiles.map((file) => file.path)
		)*/
		const uniqueFiles = Array.from(new Set(req.files.map((file) => file.originalname))).map(
			(name) => {
				return req.files.find((file) => file.originalname === name)
			}
		)
		// Process images and move them after processing
		const processedFiles = await Promise.all(
			uniqueFiles.map(async (file) => {
				const inputPath = file.path
				const outputPath = path.join(dir, `${file.originalname.split('.')[0]}.jpg`)
				//console.log('IN: ', inputPath, 'OUT: ', outputPath)
				//const outputPath = path.join(dir, file.originalname)
				// Resize and crop image
				await sharp(inputPath)
					.resize(1024, 1024, { fit: 'cover' })
					.toFormat('jpeg')
					.jpeg({ quality: 90 })
					.toFile(outputPath)

				// Delete the original file from temp after processing
				//	scheduleFileDeletion(inputPath)
				const outPath = path.posix.join(
					'/assets/img/vehicles/',
					`${make}_${model}_${vin}`,
					`${file.originalname.split('.')[0]}.jpg`
				)
				return outPath
			})
		)

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

		const imgPath = processedFiles.join(',')
		scheduleFileDeletion(path.join(__dirname, '/temp/'), 10000) // Delayed cleanup of temp directory
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
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

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
					img: row.img,
				})
			} else {
				// Handle case when no car is found
				res.status(404).send('Car not found')
			}
		}
	)
})
app.delete('/delete-listing', (req, res) => {
	const { id } = req.body // Get the listing id from the request body

	// Assuming you have a function to delete the image directories
	// This would be specific to how you're storing the files
	const success = deleteImageDirectories(id)

	// Delete the listing from the database
	db.run('DELETE FROM vehDB WHERE id = ?', [id], function (err) {
		if (err) {
			res.status(500).send('An error occurred with the database operation.')
			console.error(err.message)
			return
		}
		if (this.changes > 0) {
			res.json({ message: 'Listing deleted successfully' })
		} else {
			res.status(404).send('Listing not found.')
		}
	})
})
app.post('/preview', (req, res) => {
	const { make, model, vin } = req.body

	db.get(
		'SELECT * FROM vehDB WHERE make = ? AND model = ? AND vin = ?',
		[make, model, vin],
		(err, result) => {
			console.log('REQUEST REC')
			if (err) {
				res.status(500).send('An error occurred fetching the listing.')
				console.error(err.message)
			} else if (result) {
				let imgs = result.img.split(',') // Assuming 'img' is a valid field in the row object
				const thumbnailImage = imgs[0] // Take the first image for the thumbnail

				res.json(result)
			} else {
				res.status(404).send('Listing not found.')
			}
		}
	)
})
app.use(express.static('public'))
// serve static files from the assets directory
app.use(express.static('assets'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
module.exports = app
