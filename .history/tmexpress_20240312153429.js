const express = require('express')
const multer = require('multer')
const fs = require('fs').promises // Use the promise-based version of the fs module
const path = require('path')
const cors = require('cors')
const app = express()

const upload = multer({
	storage: multer.diskStorage({
		destination: async (req, file, cb) => {
			const { make, model, vin } = req.body
			const dir = path.join(__dirname, '/assets/img/vehicles/', `${make}_${model}_${vin}`)
			await fs.mkdir(dir, { recursive: true })
			cb(null, dir)
		},
		filename: (req, file, cb) => {
			const { make, model, vin } = req.body
			const now = Date.now()
			const extension = path.extname(file.originalname)
			cb(null, `${make}_${model}_${vin}_${now}${extension}`)
		},
	}),
})

app.use(cors())
app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/upload', upload.array('images'), async (req, res) => {
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

		const imgPaths = req.files.map((file) => file.path.replace(`${__dirname}/`, ''))
		let orderIndex = JSON.parse(req.headers['Order-Index'])

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

		const data = await fs.readFile('cars-dev.json', 'utf8')
		const carsData = JSON.parse(data)
		carsData.cars.push(newCar)
		await fs.writeFile('cars-dev.json', JSON.stringify(carsData, null, 2))

		res.json(newCar)
	} catch (err) {
		console.error(err)
		res.status(500).send('An error occurred on the server.')
	}
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
