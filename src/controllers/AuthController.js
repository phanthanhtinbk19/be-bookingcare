import argon2 from "argon2";
import db from "../models/index.js";
import {genrateRefreshToken, genrateToken} from "../config/jwt.js";
const registerUser = async (req, res) => {
	const {password, email} = req.body;
	try {
		let user = await db.User.findOne({
			where: {
				email: email,
			},
		});

		if (user) {
			return res
				.status(400)
				.json({success: false, message: "Email already taken"});
		}

		// hash password
		const hashedPassword = await argon2.hash(password || "");

		const newUser = await db.User.create({
			...req.body,
			password: hashedPassword,
		});

		// Return token
		return res.status(200).json(newUser);
	} catch (error) {
		return res.status(500).json(error);
	}
};
let refreshTokens = [];
const loginUser = async (req, res) => {
	try {
		const user = await db.User.findOne({
			where: {
				email: req.body.email,
			},
		});

		if (!user) {
			return res.status(401).json({success: false, message: "User not found"});
		}
		// Check for correct password
		const hashedPassword = await argon2.verify(
			user.password,
			req.body.password
		);

		if (!hashedPassword) {
			return res
				.status(401)
				.json({success: false, message: "Incorrect password"});
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
		return res.status(200).json({...info, accessToken});
	} catch (error) {
		return res.status(500).json(error);
	}
};

export {registerUser, loginUser};
