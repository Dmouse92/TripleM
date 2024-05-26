const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/', (req, res) => {
	console.log('Request for import.html received')
	const importPath = path.resolve(__dirname, '../public/import.html')
	console.log('Resolved import.html path:', importPath)
	res.sendFile(importPath, (err) => {
		if (err) {
			console.error('Error serving import.html:', err)
			res.status(404).send('File not found')
		}
	})
})

module.exports = router
