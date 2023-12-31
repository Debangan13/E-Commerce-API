const User = require("../models/userSchema");
const { StatusCodes } = require("http-status-codes");
const CustomeError = require("../errors");
const { attachCookiesToResponse,createTokenUser } = require("../utils");

const register = async (req, res) => {
	const { email, name, password } = req.body;

	const emailAlreadyExists = await User.findOne({ email });
	if (emailAlreadyExists) {
		throw new CustomeError.BadRequestError("Email already exists");
	}
	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? "admin" : "user";

	const user = await User.create({ email, name, password, role });
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser });

	res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new CustomeError.BadRequestError("please provide email and password");
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new CustomeError.UnauthenticatedError("Invalid Credentials");
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new CustomeError.UnauthenticatedError("Invalid Credentials");
	}

	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser });
	res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logOut = async (req, res) => {
	res.cookie("token", "logout", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.status(StatusCodes.OK).json({msg: 'user logged out!'})
};

module.exports = {
	register,
	login,
	logOut,
};
