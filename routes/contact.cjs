const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
	console.log('Request for contact.html received')
	const contactPath = path.resolve(__dirname, '../public/contact.html')
	console.log('Resolved contact.html path:', contactPath)
	res.sendFile(contactPath, (err) => {
		if (err) {
			console.error('Error serving contact.html:', err)
			res.status(404).send('File not found')
		}
	})
})

module.exports = router
