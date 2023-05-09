import db from "../models";

const createClinic = async (req, res) => {
	try {
		const result = await db.Clinic.create(req.body);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};
const getAllClinic = async (req, res) => {
	let limit = req.params.limit;
	if (!limit) limit = 10;
	try {
		const result = await db.Clinic.findAll({
			limit: +limit,
			order: [["createdAt", "DESC"]],
		});
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};
export {createClinic, getAllClinic};
