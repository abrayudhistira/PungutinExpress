const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const jwtMiddleware = require('../middleware/jwtAuth');

router.post('/register',authController.register);
router.post('/login' , authController.login);
router.get('/profile',jwtMiddleware, authController.getProfile);

module.exports = router;