import db from "../models";

const createComment = async (req, res) => {
	try {
		const result = await db.Comment.create(req.body);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};
const getAllComment = async (req, res) => {
	let limit = req.params.limit;
	if (!limit) limit = 10;
	try {
		const result = await db.Comment.findAll({
			// limit: +limit,
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: db.User,
					as: "userData",
					attributes: ["id", "firstName", "lastName", "image"],
				},
			],
			raw: true,
			nest: true,
		});
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const deleteComment = async (req, res) => {
	try {
		const result = await db.Comment.destroy({
			where: {
				id: req.params.id,
			},
		});
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};
const updateComment = async (req, res) => {

	try {
		const result = await db.Comment.update(req.body, {
			where: {
				id: req.params.id,
			},
		});
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};

export {createComment, getAllComment, deleteComment, updateComment};
