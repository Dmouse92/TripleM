const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			const { make, model, vin } = req.body
			const dir = path.join(__dirname, '/assets/img/vehicles/', `${make}_${model}_${vin}`)
			fs.mkdirSync(dir, { recursive: true })
			cb(null, dir)
		},
		filename: function (req, file, cb) {
			const { make, model, vin } = req.body
			const extension = path.extname(file.originalname)
			// Use a timestamp to ensure uniqueness
			const filename = `${make}_${model}_${vin}_${Date.now()}${extension}`
			cb(null, filename)
		},
	}),
})

app.use(cors())
app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/upload', upload.array('images'), (req, res) => {
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

		if (!req.headers['Order-Index']) {
			return res.status(400).send('Missing Order-Index header.')
		}

		const orderIndex = JSON.parse(req.headers['Order-Index'])
		const imgPaths = req.files
			.map((file, index) => {
				return file.path.replace(`${__dirname}/`, '')
			})
			.sort((a, b) => {
				// Sort the images based on the orderIndex
				return (
					orderIndex.indexOf(parseInt(path.basename(a).split('_').pop())) -
					orderIndex.indexOf(parseInt(path.basename(b).split('_').pop()))
				)
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
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			const { make, model, vin } = req.body
			const dir = path.join(__dirname, '/assets/img/vehicles/', `${make}_${model}_${vin}`)
			fs.mkdirSync(dir, { recursive: true })
			cb(null, dir)
		},
		filename: function (req, file, cb) {
			const { make, model, vin } = req.body
			const extension = path.extname(file.originalname)
			// Use a timestamp to ensure uniqueness
			const filename = `${make}_${model}_${vin}_${Date.now()}${extension}`
			cb(null, filename)
		},
	}),
})

app.use(cors())
app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/upload', upload.array('images'), (req, res) => {
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

		if (!req.headers['Order-Index']) {
			return res.status(400).send('Missing Order-Index header.')
		}

		const orderIndex = JSON.parse(req.headers['Order-Index'])
		const imgPaths = req.files
			.map((file, index) => {
				return file.path.replace(`${__dirname}/`, '')
			})
			.sort((a, b) => {
				// Sort the images based on the orderIndex
				return (
					orderIndex.indexOf(parseInt(path.basename(a).split('_').pop())) -
					orderIndex.indexOf(parseInt(path.basename(b).split('_').pop()))
				)
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
