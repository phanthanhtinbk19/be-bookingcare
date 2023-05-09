// Option 2: Passing parameters separately (sqlite)
import {Sequelize} from "sequelize";
const sequelize = new Sequelize("booking_care", "root", "", {
	host: "127.0.0.1",
	dialect: "mysql",
	port: "8111",
	logging: false,
});
let connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

export default connectDB;
