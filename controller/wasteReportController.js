const db = require('../models');
const IllegalReport = db.report; // Assuming the model is named 'report' in index.js
const path = require('path');

module.exports = {
  async getAll(req, res) {
    try {
      const reports = await IllegalReport.findAll({
        order: [['reported_at', 'DESC']],
      });
      return res.json(reports);
    } catch (err) {
      console.error('[illegalReportController.getAll] Error:', err);
      return res.status(500).json({ message: 'Gagal mengambil data laporan', error: err.message });
    }
  },

  async create(req, res) {
    // user_id dari JWT (misal req.user.user_id)
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Jika ada file uploaded, build URL
    let photo_url = null;
    if (req.file) {
      // Simpan sebagai path relatif, misal '/uploads/12345.png'
      photo_url = path.join('/uploads', req.file.filename);
    }

    const {
      location_id = null,
      latitude    = null,
      longitude   = null,
      description = null,
    } = req.body;

    try {
      const newReport = await IllegalReport.create({
        user_id,
        location_id,
        latitude,
        longitude,
        photo_url,
        description,
      });
      return res.status(201).json(newReport);
    } catch (err) {
      console.error('[illegalReportController.create] Error:', err);
      return res.status(500).json({ message: 'Gagal membuat laporan', error: err.message });
    }
  },
};
