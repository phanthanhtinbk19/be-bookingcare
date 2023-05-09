import express from "express";
import {
	createComment,
	deleteComment,
	getAllComment,
	updateComment,
} from "../controllers/CommentControllor";
const router = express.Router();

router.post("/", createComment);

router.get("/", getAllComment);
router.delete("/:id", deleteComment);
router.put("/:id", updateComment);
// router.get("/get-detail-Comment-by-id", getCommentById);

export default router;
