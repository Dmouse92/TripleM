const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
	console.log('Request for vehicles.html received')
	const vehiclesPath = path.resolve(__dirname, '../public/vehicles.html')
	console.log('Resolved vehicles.html path:', vehiclesPath)
	res.sendFile(vehiclesPath, (err) => {
		if (err) {
			console.error('Error serving vehicles.html:', err)
			res.status(404).send('File not found')
		}
	})
})

module.exports = router
