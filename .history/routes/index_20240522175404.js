const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	console.log('Serving index.html')
	res.sendFile('index.html', { root: 'public' })
})

module.exports = router
