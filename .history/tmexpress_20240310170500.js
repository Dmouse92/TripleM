const express = require('express')
const fs = require('fs')
const multer = require('multer')
const cors = require('cors')
const upload = multer()
const app = express()
app.use(express.json())

app.post('/cars-dev', upload.none(), (req, res) => {
	const data = req.body
	fs.readFile('cars-dev.json', 'utf8', (err, file) => {
		if (err) {
			console.error(err)
			res.status(500).send('Error reading file')
			return
		}
		const cars = JSON.parse(file)
		cars.push(data)
		fs.writeFile('cars-dev.json', JSON.stringify(cars, null, 2), 'utf8', (err) => {
			if (err) {
				console.error(err)
				res.status(500).send('Error writing to file')
				return
			}
			res.send('Data added successfully')
		})
	})
})

app.listen(3000, () => console.log('Server running on port 3000'))
