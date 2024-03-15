// Server-side JavaScript (Express.js)
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()

const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.array('images'), (req, res) => {
	var make = req.body.make
	var model = req.body.model
	var vin = req.body.vin

	var dir = path.join(__dirname, '/assets/img/vehicles/', make + '_' + model + '_' + vin)

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}

	for (let i = 0; i < req.files.length; i++) {
		var oldPath = req.files[i].path
		var newPath = path.join(dir, make + '_' + model + '_' + vin + '_' + (i + 1))

		fs.renameSync(oldPath, newPath) // Use renameSync instead of rename

		req.files[i].path = newPath
	}

	res.json(req.body)
})

app.listen(3000, () => console.log('Server started on port 3000'))
