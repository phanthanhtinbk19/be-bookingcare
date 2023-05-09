"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Markdown extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Markdown.belongsTo(models.Doctor_Info, {
				foreignKey: "doctorId",
			});
		}
	}
	Markdown.init(
		{
			contentHTML: DataTypes.TEXT("long"),
			description: DataTypes.TEXT("long"),
			doctorId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Markdown",
		}
	);
	return Markdown;
};
