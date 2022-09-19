"use strict";
const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn("user", "otp", {
      type: DataTypes.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.removeColumn("user", "otp");
  },
};
