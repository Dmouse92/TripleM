const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	const baseUrl = process.env.API_URL || 'http://localhost:3000'
	console.log('Request for index.html received')
	res.sendFile('index.html', { root: 'public' }, (err) => {
		if (err) {
			console.error('Error serving index.html:', err)
			res.status(404).send('File not found')
		}
	})
})
module.exports = router
