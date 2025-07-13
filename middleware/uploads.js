// middlewares/upload.js
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

// Pastikan folder uploads ada
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // nama unik: timestamp + ekstensi asli
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // batasi hanya gambar
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file JPEG, JPG, PNG yang diizinkan'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // max 5 MB
});

module.exports = upload;