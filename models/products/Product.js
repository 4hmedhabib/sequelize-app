const User = require('../user/User');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../../db/database');

const Product = sequelize.define('product', {
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: User
		}
	},
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	price: {
		type: DataTypes.DOUBLE,
		allowNull: false
	}
});

module.exports = Product;
