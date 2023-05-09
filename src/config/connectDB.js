// Option 2: Passing parameters separately (sqlite)
import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(
	process.env.DB_DATABASE_NAME,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		port: process.env.DB_PORT,
		logging: false,
	}
);

let connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

export default connectDB;
