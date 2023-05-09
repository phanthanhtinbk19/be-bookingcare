import express from "express";
import {
	createHandBook,
	getAllHandBook,
	getHandBookById,
} from "../controllers/HandBookController";

const router = express.Router();

router.post("/", createHandBook);

router.get("/", getAllHandBook);
router.get("/get-detail-handbook-by-id/:id", getHandBookById);

export default router;
