const Sequelize = require('sequelize');

const sequelize = require('../../db/database');

module.exports = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},
	name: Sequelize.STRING,
	email: Sequelize.STRING
});
