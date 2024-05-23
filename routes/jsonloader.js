const express = require('express');
const router = express.Router();

router.get('/jsonloader', (req, res) => {
    res.sendFile('jsonloader.html', { root: 'public' });
});

module.exports = router;

