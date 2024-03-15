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

		const imgPaths = req.files.map((file) => file.path.replace(`${__dirname}/`, ''))
		if (!req.headers['Order-Index']) {
			res.status(400).send('Missing Order-Index header.')
			return
		}
		let orderIndex = JSON.parse(req.headers['Order-Index'])
		req.files.forEach((file, i) => {
			if (orderIndex) {
				// Use the order index to determine the new name/path for the file
				const newPosition = orderIndex.indexOf(i)
				const newFileName = `${make}_${model}_${vin}_${newPosition}${path.extname(
					file.originalname
				)}`
				const newPath = path.join(dir, newFileName)
				// Rename and move the file here
				// ...
			}
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
			X,
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
