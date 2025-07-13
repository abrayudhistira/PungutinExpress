const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/jwtAuth');
const multer  = require('multer');
const transactionCtrl = require('../controller/transactionController');
const path = require('path');


// konfigurasi multer, simpan di folder /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/create',           auth, transactionCtrl.create);
router.get('/all',            auth, transactionCtrl.getAll);
router.get('/my',            auth, transactionCtrl.getMyTransactions);
router.get('/get/:id',         auth, transactionCtrl.getById);
router.patch('/payment/:id', auth, upload.single('payment_proof'), transactionCtrl.updatePaymentProof);

module.exports = router;
