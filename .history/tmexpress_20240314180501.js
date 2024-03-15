const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

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

app.use(cors())
app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
	req.ind = 0 // Initialize req.ind
	next()
})
app.post('/upload', upload.array('images'), async (req, res) => {
	console.log('Upload request received') // Log each request
	req.ind = 0 // Reset the index for each new submission
	console.log('CUR FILES: ', req.files)
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
			order,
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
			const outputFileName = `${make}_${model}_${vin}_${index}.jpeg` // Add a dummy suffix to the file name
			const outputPath = path.join(dir, outputFileName) // Final path without the dummy suffix

			return resizeAndCropImage(inputPath, outputPath).then(() => {
				fs.unlink(inputPath, (err) => {
					if (err) {
						console.error('Error removing original file:', err)
					} else {
						console.log('Original file removed:', inputPath)
					}
				})
				return outputPath
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
		const newCar = {
			make,
			model,
			year: Number(year),
			price: Number(price),
			vin,
			engine,
			transmission,
			drive,
			mileage: Number(mileage),
			exterior,
			interior,
			fuelEconomy,
			features: features.split(',').map((feature) => feature.trim()),
			comments,
			img: uniqueFiles.map((file) => path.relative(__dirname, file.path)),
		}

		const data = fs.readFileSync('cars.json', 'utf8')
		const carsData = JSON.parse(data)
		carsData.cars.push(newCar)
		fs.writeFileSync('cars.json', JSON.stringify(carsData, null, 2))

		res.json(newCar)
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
			return outputPath // Return the outputPath to use it later if needed
		})
		.catch((err) => {
			console.error('Error resizing and cropping image:', err)
			throw err // Rethrow the error to handle it in the catch block of the Promise chain
		})
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
