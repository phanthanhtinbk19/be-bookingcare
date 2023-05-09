import express from "express";
import {getAllCode} from "../controllers/AllCodeController";

const router = express.Router();

router.get("/", getAllCode);

export default router;
