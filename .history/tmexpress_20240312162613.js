const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()
var ind = 0
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const { make, model, vin } = req.body
		const dir = path.join(__dirname, '/assets/img/vehicles/', `${make}_${model}_${vin}`)
		fs.mkdirSync(dir, { recursive: true }) // Ensures the directory exists
		cb(null, dir)
	},
	filename: function (req, file, cb) {
		const { make, model, vin } = req.body
		const extension = path.extname(file.originalname)
		cb(null, `${make}_${model}_${vin}_${ind}${extension}`)
		++ind
	},
})

const upload = multer({ storage: storage })

app.use(
	cors({
		origin: '*', // Allow all origins - replace with your client's origin in production
		allowedHeaders: ['Order-Index'], // Allow the 'Order-Index' header
	})
)
app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
	if (req.headers['Order-Index']) {
		req.orderIndex = JSON.parse(req.headers['Order-Index'])
	}
	next()
})
app.post('/upload', upload.array('images'), (req, res) => {
	try {
		ind = 0
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

		const imgPaths = req.files.map((file) => file.path.replace(`${__dirname}/`, ''))

		const orderIndex = req.orderIndex
		console.log(orderIndex)
		console.log('Files:', req.files) // Check the uploaded files
		console.log('Order Index:', req.orderIndex) // Check the order index again

		req.files.forEach((file, i) => {
			// Use the order index to determine the new name/path for the file
			const newPosition = req.orderIndex.indexOf(i)
			console.log('New Position:', newPosition) // Check the calculated new position

			const newFileName = `${make}_${model}_${vin}_${ind}${path.extname(file.originalname)}`
			const newPath = path.join(dir, newFileName)
			console.log('New Path:', newPath) // Check the new path
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
			img: imgPaths,
		}

		const data = fs.readFileSync('cars-dev.json', 'utf8')
		const carsData = JSON.parse(data)
		carsData.cars.push(newCar)
		fs.writeFileSync('cars-dev.json', JSON.stringify(carsData, null, 2))

		res.json(newCar)
	} catch (err) {
		console.error(err)
		res.status(500).send('An error occurred on the server.')
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
