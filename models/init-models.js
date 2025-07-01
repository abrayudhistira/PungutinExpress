var DataTypes = require("sequelize").DataTypes;
var _refresh_token = require("./refresh_token");
var _user = require("./user");

function initModels(sequelize) {
  var refresh_token = _refresh_token(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  refresh_token.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(refresh_token, { as: "refresh_tokens", foreignKey: "user_id"});

  return {
    refresh_token,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
