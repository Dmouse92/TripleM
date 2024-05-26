const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
	console.log('Request for index.html received')
	const indexPath = path.resolve(__dirname, '../public/index.html')
	console.log('Resolved index.html path:', indexPath)
	res.sendFile(indexPath, (err) => {
		if (err) {
			console.error('Error serving index.html:', err)
			res.status(404).send('File not found')
		}
	})
})

module.exports = router
