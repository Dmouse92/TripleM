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
const insertData = () => {
	const insertStatements = [
		`INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('BMW', '3 Series', 2020, 35000, 'VIN12345', '3.0L I6', 'Automatic', 'RWD', 5000, 'Black', 'Leather Black', '28mpg', '30,22', 'Excellent condition');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Chevrolet', 'Malibu', 2019, 22000, 'VIN12346', '2.5L I4', 'Automatic', 'FWD', 15000, 'Silver', 'Cloth Gray', '30mpg', '32,24', 'Well maintained');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Ford', 'F150', 2018, 27000, 'VIN12347', '2.7L V6 turbo', 'Automatic', '4WD', 30000, 'Blue', 'Cloth Beige', '21mpg', '25,18', 'Regular oil changes');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Honda', 'Civic', 2021, 20000, 'VIN12348', '2.0L I4', 'CVT', 'FWD', 10000, 'Red', 'Leather White', '32mpg', '36,28', 'Single owner');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Hyundai', 'Tucson', 2019, 23000, 'VIN12349', '2.0L I4', 'Automatic', 'AWD', 25000, 'White', 'Cloth Black', '25mpg', '28,22', 'Few scratches');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Jeep', 'Wrangler', 2017, 32000, 'VIN12350', '3.6L V6', 'Manual', '4WD', 45000, 'Green', 'Cloth Green', '19mpg', '22,17', 'Custom modifications');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Kia', 'Sorento', 2020, 25000, 'VIN12351', '3.3L V6', 'Automatic', 'AWD', 20000, 'Black', 'Leather Beige', '24mpg', '27,21', 'Includes warranty');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Lexus', 'RX350', 2021, 44000, 'VIN12352', '3.5L V6', 'Automatic', 'AWD', 15000, 'Grey', 'Leather Grey', '23mpg', '27,20', 'Fully loaded');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Mercedes-Benz', 'C-Class', 2018, 33000, 'VIN12353', '2.0L I4 turbo', 'Automatic', 'RWD', 20000, 'White', 'Leather Black', '28mpg', '33,23', 'Minor wear and tear');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Nissan', 'Altima', 2019, 18000, 'VIN12354', '2.5L I4', 'CVT', 'FWD', 22000, 'Blue', 'Cloth Blue', '30mpg', '32,23', 'Great condition');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Subaru', 'Outback', 2020, 29000, 'VIN12355', '2.5L I4', 'Automatic', 'AWD', 15000, 'Green', 'Cloth Beige', '26mpg', '29,22', 'Excellent condition');``INSERT INTO vehDB (make, model, year, price, vin, engine, transmission, drive, mileage, exterior, interior, fuelEconomy, features, comments) VALUES 
('Tesla', 'Model 3', 2021, 48000, 'VIN12356', 'Electric', 'Automatic', 'RWD', 12000, 'Red', 'Vegan Leather Black', 'None', '130,120', 'Low mileage, pristine condition');`,
	]

	db.serialize(() => {
		insertStatements.forEach((stmt) => {
			db.run(stmt, (err) => {
				if (err) {
					console.error('Error executing INSERT statement', err.message)
				} else {
					console.log('Successfully inserted data into vehDB')
				}
			})
		})
	})
}

insertData()
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

		//console.log('UPLOADED: ', orderedFiles) // This will log the array of uploaded files in the correct order

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
			console.log('REN: ', file.path)
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
	// Ensure outputPath ends with '.jpg'
	if (!outputPath.endsWith('.jpg')) {
		outputPath += '.jpg' // Append '.jpg' if it's not already present
	}
	return sharp(inputPath)
		.resize(1024, 1024, { fit: 'cover' })
		.toFile(outputPath)
		.toFormat('jpeg') // Convert image to JPEG format
		.then((info) => {
			console.log('Image resized and cropped successfully:', info)

			return outputPath // Return the outputPath to use it later if needed
		})
		.catch((err) => {
			console.error('Error resizing and cropping image:', err)

			throw err // Rethrow the error to handle it in the catch block of the Promise chain
		})
}
app.get('/listings', (req, res) => {
	// Connect to your SQLite database and fetch listings
	// Respond with JSON data
	console.log('FETCH REQ')
	db.all('SELECT * FROM vehDB', [], (err, rows) => {
		if (err) {
			res.status(500).send('An error occurred on the server.')
			throw err
		}
		res.json({ cars: rows })
		console.log('LOADED')
		//console.log(res.json.toString())
	})
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
