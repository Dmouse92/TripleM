const express = require('express')
const router = express.Router()

router.get('/jsonloader', (req, res) => {
	console.log('Request for jsonloader.html received')
	res.sendFile('jsonloader.html', { root: 'public' }, (err) => {
		if (err) {
			console.error('Error serving jsonloader.html:', err)
			res.status(404).send('File not found')
		}
	})
})

module.exports = router
