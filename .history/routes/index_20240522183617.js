const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	console.log('Request for index.html received')
	res.sendFile('index.html', { root: 'public' }, (err) => {
		if (err) {
			console.error('Error serving index.html:', err)
			res.status(404).send('File not found')
		}
	})
})
module.exports = router
