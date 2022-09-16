const { DataTypes } = require("sequelize");
const db = require("../config/db");

const User = db.define(
  "user",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    mobileNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

module.exports = User;
