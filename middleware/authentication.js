const CustomeError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token;

	if (!token) {
		throw new CustomeError.UnauthenticatedError("Authentication Invalid");
	}

	try {
		const { name, userId, role } = isTokenValid({ token });
		req.user = { name, userId, role };
		next();
	} catch (error) {
		console.log(error);
	}
};


const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role) ) {
            throw new CustomeError.UnauthorizedError(
                "Unauthorized to access this route"
            );
        }
        next();
    }

};

module.exports = { authenticateUser, authorizePermissions };
