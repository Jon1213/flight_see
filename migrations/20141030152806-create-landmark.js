"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Landmarks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      lat: {
        type: DataTypes.DECIMAL
      },
      long: {
        type: DataTypes.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Landmarks").done(done);
  }
};