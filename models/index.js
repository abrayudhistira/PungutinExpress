const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

db.user = require('./user')(sequelize, Sequelize.DataTypes);
db.location = require('./location')(sequelize, Sequelize.DataTypes);
db.report = require('./illegal_report')(sequelize, Sequelize.DataTypes);
db.subscription = require('./subscription')(sequelize, Sequelize.DataTypes);
db.subscriptionPlan = require('./subscription_plan')(sequelize, Sequelize.DataTypes);
db.notification = require('./notification')(sequelize, Sequelize.DataTypes);
db.waste_sale = require('./waste_sale')(sequelize, Sequelize.DataTypes);

db.subscription.belongsTo(db.subscriptionPlan, {
  foreignKey: 'plan_id',
  as: 'subscription_plan'
});

db.subscriptionPlan.hasMany(db.subscription, {
  foreignKey: 'plan_id',
  as: 'subscriptions'
});

// Langganan dimiliki oleh satu user
db.subscription.belongsTo(db.user, {
  foreignKey: 'user_id',
  as: 'user'
});

// Satu user bisa punya banyak langganan
db.user.hasMany(db.subscription, {
  foreignKey: 'user_id',
  as: 'subscriptions'
});

db.waste_sale.belongsTo(db.user, { foreignKey: 'seller_id', as: 'seller' });
db.waste_sale.belongsTo(db.user, { foreignKey: 'buyer_id',  as: 'buyer' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;