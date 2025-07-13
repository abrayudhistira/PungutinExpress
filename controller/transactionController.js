// controller/transactionController.js

const db = require('../models');
const WasteSale = db.waste_sale;
const User     = db.user;
const path     = require('path');
const fs       = require('fs');

module.exports = {
  // POST /transactions
  // Hanya role 'citizen' yang boleh membuat listing
  async create(req, res) {
    const { user_id, role, fullname, phone } = req.user || {};
    if (!user_id || role !== 'citizen') {
      return res.status(403).json({ message: 'Forbidden: only citizens can list waste for sale' });
    }

    const { weight_kg, price_per_kg } = req.body;
    if (!weight_kg || !price_per_kg) {
      return res.status(400).json({ message: 'weight_kg and price_per_kg are required' });
    }

    try {
      const sale = await WasteSale.create({
        seller_id: user_id,
        buyer_id: null,               // belum dibeli
        weight_kg,
        price_per_kg,
        // total_price akan otomatis dihitung oleh DB
        status: 'not_yet',
      });
      return res.status(201).json(sale);
    } catch (err) {
      console.error('[transactionController.create]', err);
      return res.status(500).json({ message: 'Gagal membuat transaksi', error: err.message });
    }
  },

  // GET /transactions
  // Ambil semua transaksi, beserta data seller & buyer
  async getAll(req, res) {
    try {
      const sales = await WasteSale.findAll({
        include: [
          { model: User, as: 'seller', attributes: ['user_id','fullname','phone'] },
          { model: User, as: 'buyer',  attributes: ['user_id','fullname','phone'] },
        ],
        order: [['created_at', 'DESC']],
      });
      return res.json(sales);
    } catch (err) {
      console.error('[transactionController.getAll]', err);
      return res.status(500).json({ message: 'Gagal mengambil transaksi', error: err.message });
    }
  },

  // GET /transactions/:id
  async getById(req, res) {
    const { id } = req.params;
    try {
      const sale = await WasteSale.findByPk(id, {
        include: [
          { model: User, as: 'seller', attributes: ['user_id','fullname','phone'] },
          { model: User, as: 'buyer',  attributes: ['user_id','fullname','phone'] },
        ],
      });
      if (!sale) {
        return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
      }
      return res.json(sale);
    } catch (err) {
      console.error('[transactionController.getById]', err);
      return res.status(500).json({ message: 'Gagal mengambil transaksi', error: err.message });
    }
  },
  // controller/transactionController.js
    async getMyTransactions(req, res) {
    const user_id = req.user?.user_id;
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const sales = await WasteSale.findAll({
        where: { seller_id: user_id },
        order: [['created_at','DESC']]
        });
        return res.json(sales);
    } catch (e) {
        return res.status(500).json({ message: 'Error', error: e.message });
    }
    },

  // PATCH /transactions/:id/payment
  // Upload bukti pembayaran, hanya buyer boleh
  async updatePaymentProof(req, res) {
    const { user_id, role } = req.user || {};
    const { id } = req.params;
    if (!user_id || role !== 'buyer') {
      return res.status(403).json({ message: 'Forbidden: only buyers can upload payment proof' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Payment proof file is required' });
    }

    try {
      const sale = await WasteSale.findByPk(id);
      if (!sale) {
        return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
      }
      if (sale.status !== 'not_yet') {
        return res.status(400).json({ message: 'Transaksi sudah selesai atau tidak bisa dibayar ulang' });
      }

      // simpan file di /uploads dan simpan path relatif
      const filename = req.file.filename;
      const uploadPath = path.join('/uploads', filename);

      await sale.update({
        payment_proof_url: uploadPath,
        status: 'sold',
        buyer_id: user_id,
      });

      return res.json({ message: 'Pembayaran berhasil diupload', sale });
    } catch (err) {
      console.error('[transactionController.updatePaymentProof]', err);
      return res.status(500).json({ message: 'Gagal mengupdate bukti pembayaran', error: err.message });
    }
  },
};