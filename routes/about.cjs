const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
	console.log('Request for about.html received')
	const aboutPath = path.resolve(__dirname, '../public/about.html')
	console.log('Resolved about.html path:', aboutPath)
	res.sendFile(aboutPath, (err) => {
		if (err) {
			console.error('Error serving about.html:', err)
			res.status(404).send('File not found')
		}
	})
})

module.exports = router
