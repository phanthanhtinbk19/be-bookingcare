import db from "../models/index.js";
import {v4 as uuidv4} from "uuid";
import {
	getUserService,
	handleDeleteUser,
	handleUpdateUser,
} from "../services/authService.js";
import {sendSimpleEmail} from "../services/emailService.js";

const getUsers = async (req, res) => {
	try {
		const result = await db.User.findAll({
			attributes: {
				exclude: ["password", "image"],
			},
		});
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};
const getUser = async (req, res) => {
	let userId = req.params.id;
	if (!userId) return res.status(500).json({message: "Missing id"});
	else {
		try {
			const result = await getUserService(userId);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(500).json(error);
		}
	}
};
const updateUser = async (req, res) => {
	try {
		if (req.body.password) {
			req.body.password = await argon2.hash(req.body.password);
		}
		let userId = req.params.id;

		if (!userId) return res.status(500).json({message: "Missing id"});

		const result = await handleUpdateUser(req.body, userId);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json(error);
	}
};

const deleteUser = async (req, res) => {
	try {
		let userId = req.params.id;
		if (!userId) return res.status(500).json({message: "Missing id"});
		else {
			const result = await handleDeleteUser(userId);
			return res.status(200).json(result);
		}
	} catch (error) {
		return res.status(500).json(error);
	}
};

const buildUrlEmail = (token, doctorId) => {
	let url = `${process.env.URL_FE}/verify-book-appointment?token=${token}&doctorId=${doctorId}`;
	return url;
};
const postBookingAppointment = async (req, res) => {
	try {
		const {
			doctorId,
			doctorName,
			timeString,
			fullName,
			date,
			timeType,
			email,
			language,
			gender,
			address,
		} = req.body;
		if (!doctorId || !date || !timeType || !email || !fullName) {
			return res.status(500).json({message: "Missing params"});
		}
		let token = uuidv4();

		await sendSimpleEmail({
			receivedEmail: email,
			patientName: fullName,
			doctorName: doctorName,
			timeString: timeString,
			language: language,
			redirectLink: buildUrlEmail(token, doctorId),
		});
		const [user, created] = await db.User.findOrCreate({
			where: {email: email},
			defaults: {
				email: email,
				roleId: "R3",
				firstName: fullName,
				gender: gender,
				address: address,
			},
		});

		if (user) {
			const [booking, created] = await db.Booking.findOrCreate({
				where: {
					patientId: user.id,
				},
				defaults: {
					doctorId: doctorId,
					patientId: user.id,
					date: date,
					timeType: timeType,
					statusId: "S1",
					token: token,
				},
			});
			if (booking) {
				return res.status(200).json(booking);
			}
		}
	} catch (error) {
		return res.status(500).json(error);
	}
};

const verifyBookingAppointment = async (req, res) => {
	try {
		const {token, doctorId} = req.body;

		if (!token || !doctorId) {
			return res.status(500).json({message: "Missing params"});
		}

		let verify = await db.Booking.findOne({
			where: {
				token: token,
				doctorId: doctorId,
				statusId: "S1",
			},
			raw: false,
		});

		if (verify) {
			await verify.update({
				statusId: "S2",
			});
			return res.status(200).json({
				error: false,
				message: "Appointment has been booked",
			});
		} else {
			return res.status(200).json({
				error: true,
				message: "Appointment has been booked or does not exist",
			});
		}
	} catch (err) {
		return res.status(500).json(err);
	}
};

export {
	getUser,
	getUsers,
	updateUser,
	deleteUser,
	postBookingAppointment,
	verifyBookingAppointment,
};
