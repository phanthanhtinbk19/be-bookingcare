import authRouter from "./auth.js";
import usersRouter from "./users.js";
import allCodesRouter from "./allcodes.js";
import doctorsRouter from "./doctors.js";
import specialtiesRouter from "./specialties.js";
import clinicsRouter from "./clinics.js";
import handbooksRouter from "./handbooks.js";
import commentsRouter from "./comments.js";

let initialRoutes = (app) => {
	app.use("/api/auth", authRouter);
	app.use("/api/users", usersRouter);
	app.use("/api/allcodes", allCodesRouter);
	app.use("/api/doctors", doctorsRouter);
	app.use("/api/specialties", specialtiesRouter);
	app.use("/api/clinics", clinicsRouter);
	app.use("/api/handbooks", handbooksRouter);
	app.use("/api/comments", commentsRouter);
};
export default initialRoutes;
