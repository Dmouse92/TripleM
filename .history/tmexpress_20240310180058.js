// Server-side JavaScript (Express.js)
const http = require('http')
const host = 'localhost'
const port = 8000
const express = require('express') // Import the express module
const multer = require('multer') // Import the multer module for handling multipart/form-data, which is primarily used for uploading files
const fs = require('fs') // Import the file system (fs) module for interacting with the file system
const path = require('path') // Import the path module for handling and transforming file paths
const cors = require('cors') // Import the cors module to enable Cross-Origin Resource Sharing (CORS)
const app = express() // Initialize an Express application

const upload = multer({ dest: 'uploads/' }) // Initialize multer to accept file uploads and store them in an 'uploads' directory
// Enable All CORS Requests
app.use(cors()) // Use the cors middleware to allow cross-origin requests

// Define a POST route at '/upload' that accepts an array of files with the field name 'images'
app.post('/upload', upload.array('images'), (req, res) => {
	var make = req.body.make // Extract 'make' from the request body
	var model = req.body.model // Extract 'model' from the request body
	var year = req.body.year // Extract 'year' from the request body
	var price = req.body.price // Extract 'price' from the request body
	var engine = req.body.engine // Extract 'engine' from the request body
	var transmission = req.body.transmission // Extract 'transmission' from the request body
	var drive = req.body.drive // Extract 'drive' from the request body
	var mileage = req.body.mileage // Extract 'mileage' from the request body
	var exterior = req.body.exterior // Extract 'exterior' from the request body
	var interior = req.body.interior // Extract 'interior' from the request body
	var fuelEconomy = req.body.fuelEconomy // Extract 'fuelEconomy' from the request body
	var features = req.body.features // Extract 'features' from the request body
	var comments = req.body.comments // Extract 'comments' from the request body
	var vin = req.body.vin // Extract 'vin' from the request body

	// Construct a directory path using the make, model, and vin
	var dir = path.join(__dirname, '/assets/img/vehicles/', make + '_' + model + '_' + vin)

	// If the directory doesn't exist, create it
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}

	// For each uploaded file...
	for (let i = 0; i < req.files.length; i++) {
		var oldPath = req.files[i].path // Get the current path of the file
		// Construct a new path for the file
		var newPath = path.join(dir, make + '_' + model + '_' + vin + '_' + (i + 1))

		fs.renameSync(oldPath, newPath) // Rename (move) the file to the new path

		req.files[i].path = newPath // Update the file's path in the request object
	}

	res.json(req.body) // Send a JSON response with the request body

	// Prepare the new car data
	var newCar = {
		make: make,
		model: model,
		year: year,
		price: price,
		vin: vin,
		engine: engine,
		transmission: transmission,
		drive: drive,
		mileage: mileage,
		exterior: exterior,
		interior: interior,
		fuelEconomy: fuelEconomy,
		features: features,
		comments: comments,
		images: req.files.map((file) => file.path), // Include the paths of the uploaded images
	}

	// Read the existing data from cars-dev.json
	var data = fs.readFileSync('cars-dev.json', 'utf8')

	// Parse the data into a JavaScript object
	var carsData = JSON.parse(data)

	// Add the new car to the "cars" array
	carsData.cars.push(newCar)

	// Convert the updated data back into a JSON string
	var updatedDataJson = JSON.stringify(carsData, null, 2) // The second and third arguments add formatting to the JSON string

	// Write the updated data back to cars-dev.json
	fs.writeFileSync('cars-dev.json', updatedDataJson)
})

// Start the server on port 3000
app.listen(3000, () => console.log('Server started on port 3000'))
