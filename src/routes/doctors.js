import express from "express";
import {
	addInfoDoctor,
	addMarkDownInfoDoctor,
	createBulkSecheduleDoctor,
	getAllDoctor,
	getDetailDoctorById,
	getScheduleDoctorByDate,
	getTopDoctor,
	getExtraInfoDoctorById,
	getListPatient,
	sendRemedy,
} from "../controllers/DoctorControllor";

const router = express.Router();

router.get("/top-doctor", getTopDoctor);
router.get("/", getAllDoctor);
router.post("/save-info-doctors", addInfoDoctor);
router.get("/get-detail-doctor-by-id/:id", getDetailDoctorById);
router.post("/bulk-create-schedule-doctor", createBulkSecheduleDoctor);
router.get("/get-schedule-doctor-by-date", getScheduleDoctorByDate);
router.get("/get-extra-info-doctor-by-id/:id", getExtraInfoDoctorById);

router.get("/get-list-patient", getListPatient);
router.post("/send-remedy", sendRemedy);

export default router;
