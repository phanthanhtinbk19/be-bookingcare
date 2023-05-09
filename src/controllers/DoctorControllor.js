import _ from "lodash";
import db from "../models";
import {sendRemedyEmail} from "../services/emailService";

const MAX_NUMBER_SCHEDULE = 10;
const getTopDoctor = async (req, res) => {
	let limit = req.params.limit;
	try {
		if (!limit) limit = 10;
		let users = await db.Doctor_Info.findAll({
			limit: +limit,
			// order: [["createdAt", "DESC"]],

			include: [
				{
					model: db.User,
					as: "doctorInfoData",
					attributes: ["firstName", "lastName", "image"],
				},
				{
					model: db.Allcode,
					as: "positionData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.Specialty,
					as: "specialtyData",
					attributes: ["nameEn", "nameVi"],
				},
			],
			raw: true,
			nest: true,
		});

		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json(error);
	}
};
// const getTopDoctor = async (req, res) => {
// 	let limit = req.params.limit;
// 	try {
// 		if (!limit) limit = 10;
// 		let users = await db.User.findAll({
// 			where: {
// 				roleId: "R2",
// 			},
// 			limit: +limit,
// 			order: [["createdAt", "DESC"]],
// 			attributes: {
// 				exclude: ["password"],
// 			},
// 			include: [
// 				{
// 					model: db.Allcode,
// 					as: "positionData",
// 					attributes: ["valueEn", "valueVi"],
// 				},
// 				{
// 					model: db.Allcode,
// 					as: "genderData",
// 					attributes: ["valueEn", "valueVi"],
// 				},
// 			],
// 			raw: true,
// 			nest: true,
// 		});

// 		return res.status(200).json(users);
// 	} catch (error) {
// 		return res.status(500).json(error);
// 	}
// };

const getAllDoctor = async (req, res) => {
	try {
		let users = await db.User.findAll({
			where: {
				roleId: "R2",
			},
			order: [["createdAt", "DESC"]],
			attributes: {
				exclude: ["password", "image"],
			},
		});
		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json(error);
	}
};

let checkRequiredFields = (requiredFields, body) => {
	let result = true;
	let element = "";
	for (let field of requiredFields) {
		if (!body[field]) {
			result = false;
			element = field;
			break;
		}
	}
	return {
		result,
		element,
	};
};

const addInfoDoctor = async (req, res) => {
	const {
		doctorId,
		priceId,
		positionId,
		provinceId,
		paymentId,
		addressClinic,
		nameClinic,
		note,
		count,
		contentHTML,
		description,
		specialtyId,
		clinicId,
	} = req.body;
	try {
		let requiredFields = [
			"doctorId",
			"priceId",
			"provinceId",
			"paymentId",
			"addressClinic",
			"nameClinic",
			"note",
			"positionId",
			"contentHTML",
			"description",
			"specialtyId",
		];
		let objCheck = checkRequiredFields(requiredFields, req.body);
		if (!objCheck.result) {
			return res.status(400).json({
				message: `Missing param ${objCheck.element}`,
			});
		} else {
			let markdownInfo = await db.Markdown.findOne({
				where: {
					doctorId: doctorId,
				},
				raw: false,
			});
			if (markdownInfo) {
				markdownInfo.contentHTML = contentHTML;
				markdownInfo.description = description;
				await markdownInfo.save();
			} else {
				await db.Markdown.create({
					contentHTML: contentHTML,
					description: description,
					doctorId: doctorId,
				});
			}

			//upsert doctor info table
			let doctorInfo = await db.Doctor_Info.findOne({
				where: {
					doctorId: doctorId,
				},
				raw: false,
			});
			if (doctorInfo) {
				doctorInfo.priceId = priceId;
				doctorInfo.provinceId = provinceId;
				doctorInfo.paymentId = paymentId;
				doctorInfo.addressClinic = addressClinic;
				doctorInfo.nameClinic = nameClinic;
				doctorInfo.note = note;
				doctorInfo.count = count;
				doctorInfo.specialtyId = specialtyId;
				doctorInfo.clinicId = clinicId;
				doctorInfo.positionId = positionId;
				await doctorInfo.save();
			} else {
				await db.Doctor_Info.create({
					doctorId: doctorId,
					priceId: priceId,
					provinceId: provinceId,
					paymentId: paymentId,
					addressClinic: addressClinic,
					nameClinic: nameClinic,
					note: note,
					count: count,
					specialtyId: specialtyId,
					clinicId: clinicId,
					positionId: positionId,
				});
			}
			return res.status(200).json({message: "Success"});
		}
	} catch (error) {
		return res.status(500).json(error);
	}
};

const getDetailDoctorById = async (req, res) => {
	try {
		let doctor = await db.Doctor_Info.findOne({
			where: {
				id: req.params.id,
			},
			include: [
				{
					model: db.Markdown,
					attributes: ["contentHTML", "description"],
				},
				{
					model: db.Allcode,
					as: "priceData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.Allcode,
					as: "provinceData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.Allcode,
					as: "paymentData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.Specialty,
					as: "specialtyData",
					attributes: ["nameEn", "nameVi"],
				},
				{
					model: db.Allcode,
					as: "positionData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.User,
					as: "doctorInfoData",
					attributes: ["firstName", "lastName", "image"],
				},
			],
			raw: true,
			nest: true,
		});

		return res.status(200).json(doctor);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const createBulkSecheduleDoctor = async (req, res) => {
	try {
		let schedules = req.body.arrSchedule.map((item) => {
			return {
				...item,
				maxNumber: MAX_NUMBER_SCHEDULE,
			};
		});

		let existingSchedules = await db.Schedule.findAll({
			where: {
				doctorId: req.body.doctorId,
			},
			attributes: ["timeType", "doctorId", "date", "maxNumber"],
			raw: true,
		});

		let toCreate = _.differenceWith(schedules, existingSchedules, _.isEqual);
		let result = await db.Schedule.bulkCreate(toCreate);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const getScheduleDoctorByDate = async (req, res) => {
	const {date, doctorId} = req.query;

	try {
		let schedules = await db.Schedule.findAll({
			where: {
				doctorId: doctorId,
				date: date,
			},
			include: [
				{
					model: db.Allcode,
					as: "timeTypeData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.User,
					as: "doctorData",
					attributes: ["firstName", "lastName"],
				},
			],
			raw: true,
			nest: true,
		});
		return res.status(200).json(schedules);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const getExtraInfoDoctorById = async (req, res) => {
	try {
		let doctorInfo = await db.Doctor_Info.findOne({
			where: {
				doctorId: req.params.id,
			},
			attributes: {
				exclude: ["id", "doctorId"],
			},
			include: [
				{
					model: db.Allcode,
					as: "priceData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.Allcode,
					as: "provinceData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.Allcode,
					as: "paymentData",
					attributes: ["valueEn", "valueVi"],
				},
			],
			raw: true,
			nest: true,
		});
		return res.status(200).json(doctorInfo);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const getProfileDoctorById = async (req, res) => {
	try {
		let doctor = await db.User.findOne({
			where: {
				id: req.params.id,
			},
			attributes: {
				exclude: ["password"],
			},
			include: [
				{
					model: db.Markdown,
					attributes: ["contentHTML", "description"],
				},
				{
					model: db.Allcode,
					as: "positionData",
					attributes: ["valueEn", "valueVi"],
				},
				{
					model: db.Doctor_Info,
					attributes: {
						exclude: ["id", "doctorId"],
					},
					include: [
						{
							model: db.Allcode,
							as: "priceData",
							attributes: ["valueEn", "valueVi"],
						},
						{
							model: db.Allcode,
							as: "provinceData",
							attributes: ["valueEn", "valueVi"],
						},
						{
							model: db.Allcode,
							as: "paymentData",
							attributes: ["valueEn", "valueVi"],
						},
					],
				},
			],
			raw: true,
			nest: true,
		});

		return res.status(200).json(doctor);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const getListPatient = async (req, res) => {
	const {doctorId, date} = req.query;
	try {
		let patients = await db.Booking.findAll({
			where: {
				statusId: "S2",
				doctorId: doctorId,
				date: date,
			},

			include: [
				{
					model: db.User,
					as: "patientData",
					attributes: ["firstName", "email", "address", "gender"],
					include: [
						{
							model: db.Allcode,
							as: "genderData",
							attributes: ["valueEn", "valueVi"],
						},
					],
				},
				{
					model: db.Allcode,
					as: "timeTypeBookingData",
					attributes: ["valueEn", "valueVi"],
				},
			],
			raw: true,
			nest: true,
		});
		return res.status(200).json(patients);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const sendRemedy = async (req, res) => {
	const {doctorId, patientId, email, timeType} = req.body;
	try {
		const appointment = await db.Booking.findOne({
			where: {
				doctorId: doctorId,
				patientId: patientId,
				timeType: timeType,
				statusId: "S2",
			},
			raw: false,
		});
		if (appointment) {
			appointment.statusId = "S3";
			await appointment.save();
		}

		await sendRemedyEmail(req.body);
		return res.status(200).json({message: "success"});
	} catch (error) {
		return res.status(500).json(error);
	}
};
export {
	getTopDoctor,
	getAllDoctor,
	addInfoDoctor,
	getDetailDoctorById,
	createBulkSecheduleDoctor,
	getScheduleDoctorByDate,
	getExtraInfoDoctorById,
	getProfileDoctorById,
	getListPatient,
	sendRemedy,
};
