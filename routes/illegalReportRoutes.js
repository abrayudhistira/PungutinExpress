const express = require('express');
const router  = express.Router();
const upload  = require('../middleware/uploads');
const illegalReportCtrl = require('../controller/wasteReportController');
const jwtMiddleware = require('../middleware/jwtAuth');

// GET all
router.get('/all', illegalReportCtrl.getAll);

// POST new with single file upload (field name: 'photo')
router.post(
  '/post',
  upload.single('photo'),
  jwtMiddleware,
  illegalReportCtrl.create
);

module.exports = router;
