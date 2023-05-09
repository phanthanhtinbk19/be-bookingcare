import express from "express";
import {
	deleteUser,
	getUser,
	getUsers,
	postBookingAppointment,
	verifyBookingAppointment,
	updateUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/patient-book-appointment", postBookingAppointment);
router.post("/verify-book-appointment", verifyBookingAppointment);

export default router;
