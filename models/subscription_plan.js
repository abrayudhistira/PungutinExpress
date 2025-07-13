const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subscription_plan', {
    plan_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false
    },
    frequency: {
      type: DataTypes.ENUM('daily','weekly','monthly'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'subscription_plan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "plan_id" },
        ]
      },
    ]
  });
};
