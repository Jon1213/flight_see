"use strict";

module.exports = function(sequelize, DataTypes) {
  var Landmark = sequelize.define("Landmark", {
    name: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    long: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Landmark;
};
