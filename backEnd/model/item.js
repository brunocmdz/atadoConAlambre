const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'items',
  timestamps: true
});

module.exports = Item;