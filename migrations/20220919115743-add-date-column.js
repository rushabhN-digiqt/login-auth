"use strict";
const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn("user", "expiration_time", {
      type: DataTypes.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.removeColumn("user", "expiration_time");
  },
};
