const User = require("../models/userSchema");
const { StatusCodes } = require("http-status-codes");
const CustomeError = require("../errors");
const {createTokenUser,attachCookiesToResponse,checkPermission} = require('../utils')

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: "user" }).select("-password");
	res.status(StatusCodes.OK).json({ users });
};

const getSingleUsers = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select("-password");
	if (!user) {
		throw new CustomeError.NotFoundError(`No user with id ${req.params.id}`);
	}

	checkPermission(req.user,user._id)
	res.status(StatusCodes.OK).json({ user });
};

const showCurrentUsers = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

// ------------ Updating user using findOneAndUpdate ------------
// const updateUsers = async (req, res) => {
	// const { name, email } = req.body;
	// if (!name || !email) {
	// 	throw new CustomeError.BadRequestError("please provide all values");
	// }

	// const user = await User.findOneAndUpdate(
	// 	{ _id: req.user.userId },
	// 	{ name, email },
	// 	{ new: true, runValidators: true }
	// );

	// ------------ Upadting user user.save() ------------
	const updateUsers = async (req, res) => {
	const { name, email } = req.body;
	if (!name || !email) {
		throw new CustomeError.BadRequestError("please provide all values");
	} 

	const user = await User.findOne({_id: req.user.userId})
	user.email = email
	user.name = name
	await user.save()	
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.OK).json({user:tokenUser});
};

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new CustomeError.BadRequestError("Invalid Credentials");
	}

	const user = await User.findOne({ _id: req.user.userId });
	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new CustomeError.UnauthenticatedError("Invalid Credentials");
	}
	user.password = newPassword;
	await user.save();

	res.status(StatusCodes.OK).json({ msg: "success! password updated" });
};

module.exports = {
	getAllUsers,
	getSingleUsers,
	showCurrentUsers,
	updateUsers,
	updateUserPassword,
};
