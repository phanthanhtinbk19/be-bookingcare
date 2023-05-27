import express from "express";
import cors from "cors";
const app = express();
import router from "./routes/index.js";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";

dotenv.config();

app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
app.use(express.json());

const port = process.env.PORT || 5000;

//middleware

router(app);

connectDB();
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
