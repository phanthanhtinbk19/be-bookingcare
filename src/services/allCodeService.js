import db from "../models";
const getAllCodeService = (type) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!type) {
				resolve({
					errCode: 1,
					errMessage: "Type is required",
				});
			} else {
				let data = await db.Allcode.findAll({
					where: {
						type: type,
					},
				});
				resolve(data);
			}
		} catch (error) {}
	});
};

export {getAllCodeService};
