const db = require('../models');
const Subscription = db.subscription;
const SubscriptionPlan = db.subscriptionPlan;

module.exports = {
  // POST /subscribe
  async subscribe(req, res) {
    console.log('[subscribe] req.user =', req.user);
    const user_id = req.user?.user_id;
    const { plan_id } = req.body;
    if (!user_id) {
    console.log('[subscribe] Unauthorized, user_id missing');
    return res.status(401).json({ message: 'Unauthorized' });
  }

    try {
      // cek apakah user sudah berlangganan aktif
      const existing = await Subscription.findOne({
        where: { user_id, is_active: true }
      });
      if (existing) {
        return res.status(400).json({ message: 'Anda sudah memiliki langganan aktif' });
      }

      // ambil plan utk mendapatkan frekuensi
      const plan = await SubscriptionPlan.findByPk(plan_id);
      if (!plan) {
        return res.status(404).json({ message: 'Paket tidak ditemukan' });
      }

      // hitung end_date berdasarkan frequency
      const startDate = new Date();
      let endDate = null;
      switch (plan.frequency) {
        case 'daily':
          endDate = new Date(startDate.getTime() + 1 * 24*60*60*1000);
          break;
        case 'weekly':
          endDate = new Date(startDate.getTime() + 7 * 24*60*60*1000);
          break;
        case 'monthly':
          endDate = new Date(startDate.setMonth(startDate.getMonth()+1));
          break;
      }

      const newSub = await Subscription.create({
        user_id,
        plan_id,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
      });
      return res.status(201).json(newSub);
    } catch (err) {
      console.error('[subscriptionController.subscribe] Error:', err);
      return res.status(500).json({ message: 'Gagal berlangganan', error: err.message });
    }
  },
  // PATCH /subscriptions/status/:id
    async updateSubscriptionStatus(req, res) {
        const user_id = req.user?.user_id;
        const { id } = req.params;
        const { is_active } = req.body;

        if (!user_id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ message: 'Field "is_active" harus boolean' });
        }

        try {
            const sub = await Subscription.findOne({
            where: { subscription_id: id, user_id }
            });

            if (!sub) {
            return res.status(404).json({ message: 'Langganan tidak ditemukan' });
            }

            // Update status aktif (dan jika tidak aktif, set end_date ke sekarang)
            await sub.update({
            is_active,
            end_date: is_active ? sub.end_date : new Date()
            });

            return res.json({ message: `Status langganan diperbarui ke ${is_active ? 'aktif' : 'tidak aktif'}` });
        } catch (err) {
            console.error('[subscriptionController.updateSubscriptionStatus] Error:', err);
            return res.status(500).json({
            message: 'Gagal mengupdate status langganan',
            error: err.message
            });
        }
    },
    // Untuk role: provider (admin langganan)
    async updateSubscriptionStatusByProvider(req, res) {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
        return res.status(400).json({ message: 'Field "is_active" harus boolean' });
    }

    try {
        const sub = await Subscription.findByPk(id);

        if (!sub) {
        return res.status(404).json({ message: 'Langganan tidak ditemukan' });
        }

        await sub.update({
        is_active,
        end_date: is_active ? sub.end_date : new Date()
        });

        return res.json({ message: `Status langganan diperbarui ke ${is_active ? 'aktif' : 'tidak aktif'}` });
    } catch (err) {
        console.error('[subscriptionController.updateSubscriptionStatusByProvider] Error:', err);
        return res.status(500).json({
        message: 'Gagal mengupdate status langganan',
        error: err.message
        });
    }
    },
  // GET /subscriptions (semua milik user)
  async getUserSubscriptions(req, res) {
    const user_id = req.user?.user_id;
    if (!user_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const subs = await Subscription.findAll({
        where: { user_id },
        include: [{ model: SubscriptionPlan, as: 'subscription_plan' }],
        order: [['created_at', 'DESC']],
        });

        if (!subs || subs.length === 0) {
        // Jika tidak ada langganan
        return res
            .status(200)
            .json({ message: 'Anda belum berlangganan' });
        }

        // Jika ada, kembalikan array langganan
        return res.json(subs);
    } catch (err) {
        console.error('[subscriptionController.getUserSubscriptions] Error:', err);
        return res
        .status(500)
        .json({ message: 'Gagal mengambil langganan', error: err.message });
    }
    },

  // DELETE /unsubscribe/:id (batalkan langganan)
  async cancelSubscription(req, res) {
    const user_id = req.user?.user_id;
    const { id } = req.params;
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const sub = await Subscription.findOne({ where: { subscription_id: id, user_id } });
      if (!sub) {
        return res.status(404).json({ message: 'Langganan tidak ditemukan' });
      }
      // tandai tidak aktif
      await sub.update({ is_active: false, end_date: new Date() });
      return res.json({ message: 'Langganan dibatalkan' });
    } catch (err) {
      console.error('[subscriptionController.cancelSubscription] Error:', err);
      return res.status(500).json({ message: 'Gagal membatalkan langganan', error: err.message });
    }
  },
    async getallUserSubscriptions(req, res) {
    try {
        const subs = await Subscription.findAll({
        include: [
            {
            model: SubscriptionPlan,
            as: 'subscription_plan',
            },
            {
            model: db.user,
            as: 'user',
            attributes: ['user_id', 'username'], // Ambil nama user
            },
        ],
        order: [['created_at', 'DESC']],
        });

        // Ubah hasil agar cocok dengan kebutuhan frontend
        const result = subs.map((s) => ({
        subscription_id: s.subscription_id,
        user_id: s.user_id,
        user_name: s.user?.username ?? 'Tidak diketahui',
        plan: {
            name: s.subscription_plan?.name ?? '',
            description: s.subscription_plan?.description ?? '',
            frequency: s.subscription_plan?.frequency ?? '',
            price: s.subscription_plan?.price ?? 0,
        },
        start_date: s.start_date,
        end_date: s.end_date,
        is_active: s.is_active,
        }));

        return res.json(result);
    } catch (err) {
        console.error('[subscriptionController.getAllUserSubscriptions] Error:', err);
        return res.status(500).json({ message: 'Gagal mengambil semua langganan', error: err.message });
    }
    }
};
