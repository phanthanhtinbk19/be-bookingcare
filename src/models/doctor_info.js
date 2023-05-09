"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Doctor_Info extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Doctor_Info.belongsTo(models.User, {
				foreignKey: "doctorId",
				targetKey: "id",
				as: "doctorInfoData",
			});
			Doctor_Info.belongsTo(models.Allcode, {
				foreignKey: "positionId",
				targetKey: "keyMap",
				as: "positionData",
			});
			Doctor_Info.belongsTo(models.Allcode, {
				foreignKey: "priceId",
				targetKey: "keyMap",
				as: "priceData",
			});
			Doctor_Info.belongsTo(models.Allcode, {
				foreignKey: "provinceId",
				targetKey: "keyMap",
				as: "provinceData",
			});
			Doctor_Info.belongsTo(models.Allcode, {
				foreignKey: "paymentId",
				targetKey: "keyMap",
				as: "paymentData",
			});
			Doctor_Info.belongsTo(models.Specialty, {
				foreignKey: "specialtyId",
				targetKey: "id",
				as: "specialtyData",
			});
			Doctor_Info.hasOne(models.Markdown, {
				foreignKey: "doctorId",
			});
		}
	}
	Doctor_Info.init(
		{
			doctorId: DataTypes.INTEGER,
			positionId: DataTypes.STRING,
			specialtyId: DataTypes.INTEGER,
			clinicId: DataTypes.INTEGER,
			priceId: DataTypes.STRING,
			provinceId: DataTypes.STRING,
			paymentId: DataTypes.STRING,
			addressClinic: DataTypes.STRING,
			nameClinic: DataTypes.STRING,
			note: DataTypes.STRING,
			count: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Doctor_Info",
			freezeTableName: true,
		}
	);
	return Doctor_Info;
};
