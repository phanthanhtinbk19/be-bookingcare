import jwt from "jsonwebtoken";
const genrateToken = (user) => {
	return jwt.sign(
		{id: user._id, roleId: user.roleId},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "10d",
		}
	);
};
const genrateRefreshToken = (user) => {
	return jwt.sign(
		{id: user._id, roleId: user.roleId},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "17d",
		}
	);
};
export {genrateToken, genrateRefreshToken};
