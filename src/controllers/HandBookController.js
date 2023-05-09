import db from "../models";

const createHandBook = async (req, res) => {
	try {
		const result = await db.HandBook.create(req.body);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};
const getAllHandBook = async (req, res) => {
	let limit = req.query.limit;
	if (!limit) limit = 10;
	try {
		const result = await db.HandBook.findAll({
			limit: +limit,
			order: [["createdAt", "DESC"]],
		});
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const getHandBookById = async (req, res) => {
	try {
		const {id} = req.params;
		if (!id) return res.status(400).json("Missing required fields");

		let data = await db.HandBook.findOne({
			where: {
				id: id,
			},
		});
		if (data) {
			let doctorSpecialty = await db.Doctor_Info.findAll({
				where: {
					specialtyId: id,
				},
				attributes: ["doctorId", "provinceId"],
				include: [
					{
						model: db.Allcode,
						as: "provinceData",
						attributes: ["valueEn", "valueVi"],
					},
				],
				raw: true,
				nest: true,
			});
			data.doctorSpecialty = doctorSpecialty;
		}
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json(error);
	}
};

export {createHandBook, getAllHandBook, getHandBookById};
