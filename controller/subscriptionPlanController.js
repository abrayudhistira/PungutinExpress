const db = require('../models');
const SubscriptionPlan = db.subscriptionPlan;

module.exports = {
  // GET /plans
  async getAllPlans(req, res) {
    try {
      const plans = await SubscriptionPlan.findAll({
        order: [['price', 'ASC']],
      });
      return res.json(plans);
    } catch (err) {
      console.error('[subscriptionPlanController.getAllPlans] Error:', err);
      return res.status(500).json({ message: 'Gagal mengambil daftar paket', error: err.message });
    }
  },

  // GET /plans/:id
  async getPlanById(req, res) {
    try {
      const plan = await SubscriptionPlan.findByPk(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: 'Paket tidak ditemukan' });
      }
      return res.json(plan);
    } catch (err) {
      console.error('[subscriptionPlanController.getPlanById] Error:', err);
      return res.status(500).json({ message: 'Gagal mengambil paket', error: err.message });
    }
  },

  // POST /plans
  async createPlan(req, res) {
    const { name, description, price, frequency } = req.body;
    try {
      const newPlan = await SubscriptionPlan.create({ name, description, price, frequency });
      return res.status(201).json(newPlan);
    } catch (err) {
      console.error('[subscriptionPlanController.createPlan] Error:', err);
      return res.status(500).json({ message: 'Gagal membuat paket', error: err.message });
    }
  },

  // PUT /plans/:id
  async updatePlan(req, res) {
    const { name, description, price, frequency } = req.body;
    try {
      const plan = await SubscriptionPlan.findByPk(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: 'Paket tidak ditemukan' });
      }
      await plan.update({ name, description, price, frequency });
      return res.json(plan);
    } catch (err) {
      console.error('[subscriptionPlanController.updatePlan] Error:', err);
      return res.status(500).json({ message: 'Gagal mengubah paket', error: err.message });
    }
  },

  // DELETE /plans/:id
  async deletePlan(req, res) {
    try {
      const plan = await SubscriptionPlan.findByPk(req.params.id);
      if (!plan) {
        return res.status(404).json({ message: 'Paket tidak ditemukan' });
      }
      await plan.destroy();
      return res.json({ message: 'Paket berhasil dihapus' });
    } catch (err) {
      console.error('[subscriptionPlanController.deletePlan] Error:', err);
      return res.status(500).json({ message: 'Gagal menghapus paket', error: err.message });
    }
  },
};