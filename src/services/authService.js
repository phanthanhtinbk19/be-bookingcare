import argon2 from "argon2";
import db from "../models/index.js";
import {genrateRefreshToken, genrateToken} from "../config/jwt.js";

const createNewUser = async (data, res) => {
	try {
		let user = await db.User.findOne({
			where: {
				email: data?.email,
			},
		});
		if (user) {
			return res
				.status(400)
				.json({success: false, message: "Username already taken"});
		}

		// hash password
		const hashedPassword = await argon2.hash(data.password || "");

		const newUser = await db.User.create({
			...data,
			password: hashedPassword,
		});

		// Return token
		return newUser;
	} catch (error) {
		return res.status(500).json(error);
	}
};

let refreshTokens = [];
const loginUserService = (data, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await db.User.findOne({
				where: {
					email: data.email,
				},
			});

			if (!user) {
				return resolve({success: false, message: "User not found"});
			}

			// Check for correct password
			const hashedPassword = await argon2.verify(user.password, data.password);

			if (!hashedPassword) {
				resolve({success: false, message: "Incorrect password"});
			}

			const {password, ...info} = user;

			const accessToken = genrateToken(user);

			const refreshToken = genrateRefreshToken(user);

			refreshTokens.push(refreshToken);
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: false,
				path: "/",
				sameSite: "strict",
			});
			resolve({...info, accessToken});
		} catch (error) {
			reject(error);
		}
	});
};

// const getUsersService = async (req, res) => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			const result = await db.User.findAll();
// 			resolve(result);
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// };
const getUserService = async (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await db.User.findOne({
				where: {
					id: userId,
				},
			});
			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

const handleUpdateUser = async (data, userId) => {
	try {
		const updatedUser = await db.User.update(
			{
				...data,
			},
			{
				where: {
					id: userId,
				},
			}
		);

		return updatedUser;
	} catch (error) {
		console.log(error);
	}
};

const handleDeleteUser = async (userId) => {
	try {
		const deletedUser = await db.User.destroy({
			where: {
				id: userId,
			},
		});
		return deletedUser;
	} catch (error) {
		console.log(error);
	}
};

const hashUserPassword = async (password) => {
	try {
		let hashPassword = await bcrypt.hashSync(password, salt);
		return hashPassword;
	} catch (error) {
		console.log(error);
	}
};

export {
	createNewUser,
	loginUserService,
	getUserService,
	handleUpdateUser,
	handleDeleteUser,
};
