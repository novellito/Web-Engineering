const express = require('express');
const router = express.Router();
const controller = require('../controllers/message');

router.post('/message', controller.addMessage);

module.exports = router;
