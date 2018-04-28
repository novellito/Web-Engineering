const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

router.get('/userRecepients/:userId', controller.listRecepients);

//Find a user by login info
router.post('/userCreds', controller.verifyLogin);

// retrieve a user by their id
router.get('/user/:userId', controller.getUserById);

//Add new user
router.post('/user', controller.addNewUser);

//update a user
router.put('/user/:userId', controller.updateUser);

module.exports = router;
