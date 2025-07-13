const express = require('express');
const router = express.Router();
const locationController = require('../controller/locationController');
const jwtMiddleware = require('../middleware/jwtAuth');

// Endpoint publik, tidak perlu JWT
router.get('/all', locationController.getAllLocations);
router.post('/post', jwtMiddleware,locationController.createLocation);
router.get('/get/:user_id', locationController.getLocationsByProvider);

module.exports = router;