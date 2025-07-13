var DataTypes = require("sequelize").DataTypes;
var _waste_sale = require("./waste_sale");

function initModels(sequelize) {
  var waste_sale = _waste_sale(sequelize, DataTypes);

  waste_sale.belongsTo(user, { as: "seller", foreignKey: "seller_id"});
  user.hasMany(waste_sale, { as: "waste_sales", foreignKey: "seller_id"});
  waste_sale.belongsTo(user, { as: "buyer", foreignKey: "buyer_id"});
  user.hasMany(waste_sale, { as: "buyer_waste_sales", foreignKey: "buyer_id"});

  return {
    waste_sale,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
