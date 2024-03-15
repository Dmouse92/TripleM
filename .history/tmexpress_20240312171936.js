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
			order,
		} = req.body
		// Define dir here
		const dir = path.join(__dirname, '/assets/img/vehicles/', `${make}_${model}_${vin}`)

		if (!order) {
			throw new Error('Order is not provided in the request body.')
		}
		/*
		const imgPaths = req.files.map((file) => file.path.replace(`${__dirname}/`, ''))

		const orderIndex = JSON.parse(order) // Parse the order of the images
		console.log(orderIndex)
		console.log('Files:', req.files) // Check the uploaded files

		req.files.forEach((file, i) => {
			// Use the order index to determine the new name/path for the file
			const newPosition = orderIndex.indexOf(i)
			console.log('New Position:', newPosition) // Check the calculated new position

			const newFileName = `${make}_${model}_${vin}_${req.ind}${path.extname(file.originalname)}`
			const newPath = path.join(dir, newFileName)
			req.ind++
			console.log('New Path:', newPath) // Check the new path
		})
		*/

		// Parse the order of the images
		const orderIndex = JSON.parse(order)
		const order2 = JSON.parse(req.body.order)

		console.log(orderIndex)
		// Remove duplicates from req.files
		const uniqueFiles = Array.from(new Set(req.files.map((file) => file.originalname))).map(
			(name) => {
				return req.files.find((file) => file.originalname === name)
			}
		)

		// Sort the uniqueFiles array based on the orderIndex
		uniqueFiles.sort(
			(a, b) => orderIndex.indexOf(a.originalname) - orderIndex.indexOf(b.originalname)
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
		console.log('Files:', uniqueFiles) //
		// Map the files to their new paths
		const imgPaths = uniqueFiles.map((file) => {
			const newFileName = `${make}_${model}_${vin}_${req.ind}${path.extname(file.originalname)}`
			const newPath = path.join(dir, newFileName)
			fs.rename(file.path, newPath, (err) => {
				if (err) {
					console.error('Failed to rename and move file', err)
				} else {
					console.log('File renamed and moved successfully')
				}
			})
			req.ind++
			console.log('New Path:', newPath) // Check the new path
			return newPath.replace(`${__dirname}/`, '')
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
