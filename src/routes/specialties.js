import express from "express";
import {
	createSpecialty,
	getSpecialty,
	getSpecialtyById,
} from "../controllers/SpecialtyControllor";

const router = express.Router();

router.post("/", createSpecialty);
router.get("/", getSpecialty);
router.get("/get-detail-specialty-by-id", getSpecialtyById);

export default router;
