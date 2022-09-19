"use strict";

const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          "user",
          "email",
          {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
        queryInterface.changeColumn(
          "user",
          "mobileNo",
          {
            allowNull: true,
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return await queryInterface.removeColumn("user", ["email", "mobileNo"]);
  },
};
