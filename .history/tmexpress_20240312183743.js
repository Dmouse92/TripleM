const express = require('express')
const multer = require('multer')
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
		const { make, model, vin } = req.body
		const extension = path.extname(file.originalname)
		cb(null, `${make}_${model}_${vin}_${req.ind}${extension}`)
		req.ind++
	},
})

const upload = multer({ storage: storage })

app.use(cors())
app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
	req.ind = 0 // Initialize req.ind
	next()
})
app.post('/upload', upload.array('images'), (req, res) => {
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

		console.log('ORDER: ', orderedFiles) // This will log the array of uploaded files in the correct order

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
