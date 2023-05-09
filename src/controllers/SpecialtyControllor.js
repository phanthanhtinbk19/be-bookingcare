import db from "../models/index.js";

const createSpecialty = async (req, res) => {
	try {
		const result = await db.Specialty.create(req.body);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};
const getSpecialty = async (req, res) => {
	let limit = req.query.limit;
	// if (!limit) limit = 10;
	try {
		const result = await db.Specialty.findAll({
			limit: +limit,
		});
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};
const getSpecialtyById = async (req, res) => {
	try {
		const {id, location} = req.query;
		if ((!id, !location))
			return res.status(400).json("Missing required fields");

		let data = await db.Specialty.findOne({
			where: {
				id: id,
			},
		});
		if (data) {
			let doctorSpecialty = [];
			if (location === "all") {
				doctorSpecialty = await db.Doctor_Info.findAll({
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
			} else {
				doctorSpecialty = await db.Doctor_Info.findAll({
					where: {
						specialtyId: id,
						provinceId: location,
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
			}
			data.doctorSpecialty = doctorSpecialty;
		}
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json(error);
	}
};
export {createSpecialty, getSpecialty, getSpecialtyById};
