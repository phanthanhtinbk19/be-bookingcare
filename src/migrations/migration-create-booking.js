"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Bookings", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			statusId: {
				type: Sequelize.STRING,
			},
			patientId: {
				type: Sequelize.INTEGER,
			},
			doctorId: {
				type: Sequelize.INTEGER,
			},
			date: {
				type: Sequelize.STRING,
			},
			timeType: {
				type: Sequelize.STRING,
			},
			note: {
				type: Sequelize.STRING,
			},
			token: {
				type: Sequelize.STRING,
			},

			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Bookings");
	},
};
