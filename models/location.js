const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('location', {
    location_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    provider_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('TPS','TPA','TPPengelolaan'),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(10,7),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'location',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "location_id" },
        ]
      },
      {
        name: "idx_loc_provider",
        using: "BTREE",
        fields: [
          { name: "provider_id" },
        ]
      },
    ]
  });
};
