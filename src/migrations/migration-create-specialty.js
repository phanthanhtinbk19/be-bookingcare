"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Specialties", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			nameVi: {
				type: Sequelize.STRING,
			},
			nameEn: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.TEXT("long"),
			},
			image: {
				type: Sequelize.BLOB("long"),
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
		await queryInterface.dropTable("Specialties");
	},
};
