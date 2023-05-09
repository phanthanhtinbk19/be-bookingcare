import db from "../models/index.js";

const getAllCode = async (req, res) => {
	const {type} = req.query;
	try {
		if (!type) return res.status(401).json({message: "Missing type"});

		let data = await db.Allcode.findAll({
			where: {
				type: type,
			},
		});
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json(error);
	}
};

export {getAllCode};
