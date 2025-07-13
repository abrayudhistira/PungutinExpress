const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const profileController = require('../controller/profileController');
const jwtMiddleware = require('../middleware/jwtAuth');

// Setup multer untuk upload ke folder /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route edit profile (protected)
router.post('/edit', jwtMiddleware, upload.single('photo'), profileController.editProfile);

module.exports = router;