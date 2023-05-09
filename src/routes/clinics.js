import express from "express";
import {createClinic, getAllClinic} from "../controllers/ClinicControllor";
const router = express.Router();

router.post("/", createClinic);

router.get("/", getAllClinic);
// router.get("/get-detail-clinic-by-id", getClinicById);

export default router;
