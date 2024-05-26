const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
	console.log('Request for jsonloader.html received')
	const jsonloaderPath = path.resolve(__dirname, '../public/jsonloader.html')
	console.log('Resolved jsonloader.html path:', jsonloaderPath)
	res.sendFile(jsonloaderPath, (err) => {
		if (err) {
			console.error('Error serving jsonloader.html:', err)
			res.status(404).send('File not found')
		}
	})
})

module.exports = router
