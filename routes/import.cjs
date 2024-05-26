const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.sendFile('import.html', { root: 'public' })
})

module.exports = router
