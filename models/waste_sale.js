const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('waste_sale', {
    sale_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    seller_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    buyer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    weight_kg: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: false
    },
    price_per_kg: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    total_price: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true
    },
    payment_proof_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('sold','not_yet'),
      allowNull: false,
      defaultValue: "not_yet"
    }
  }, {
    sequelize,
    tableName: 'waste_sale',
    createdAt: 'created_at',
    updatedAt: false,
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sale_id" },
        ]
      },
      {
        name: "idx_sale_seller",
        using: "BTREE",
        fields: [
          { name: "seller_id" },
        ]
      },
      {
        name: "idx_sale_buyer",
        using: "BTREE",
        fields: [
          { name: "buyer_id" },
        ]
      },
    ]
  });
};
