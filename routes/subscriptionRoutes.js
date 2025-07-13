const router = require('express').Router();
const auth = require('../middleware/jwtAuth');
const spCtrl = require('../controller/subscriptionPlanController');
const sCtrl  = require('../controller/subscriptionController');

// Paket langganan
router.get('/plans',    spCtrl.getAllPlans);
router.get('/plans/:id',spCtrl.getPlanById);
router.post('/plans',   spCtrl.createPlan);
router.put('/plans/:id',spCtrl.updatePlan);
router.delete('/plans/:id', spCtrl.deletePlan);

// Berlangganan
router.post('/post',       auth, sCtrl.subscribe);
router.get('/all',    auth, sCtrl.getUserSubscriptions);
router.delete('/cancel/:id', auth, sCtrl.cancelSubscription);
router.patch('/update/:id',   auth,sCtrl.updateSubscriptionStatus);
router.patch('/provider/update/:id',   auth,sCtrl.updateSubscriptionStatusByProvider);
router.get('/subscription', auth, sCtrl.getallUserSubscriptions);

module.exports = router;