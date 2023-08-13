const CustomeError = require("../errors");

const checkPermission = (requestUser, resourceUserId) => {
	// console.log(requestUser, resourceUserId);
	// console.log(typeof resourceUserId);
	if (requestUser.role === "admin") return;
	if (requestUser.userId === resourceUserId.toString()) return;
	throw new CustomeError.UnauthorizedError(
		"not authorized to access this route"
	);
};

module.exports = { checkPermission };
