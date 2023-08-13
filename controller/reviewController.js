const Review = require("../models/reviewSchema");
const Product = require("../models/productSchema");
const { StatusCodes } = require("http-status-codes");
const CustomeError = require("../errors");
const { checkPermission } = require("../utils");
const reviewSchema = require("../models/reviewSchema");

const createReview = async (req, res) => {
	const { product: productId } = req.body;

	const isValidProduct = await Product.findOne({ _id: productId });
	if (!isValidProduct) {
		throw new CustomeError.NotFoundError(`No product with id: ${productId} `);
	}

	const alreadySubmitted = await Review.find({
		product: productId,
		user: req.user.userId,
	});

	if (!alreadySubmitted) {
		throw new CustomeError.BadRequestError(
			"Already submitted review for this product"
		);
	}

	req.body.user = req.user.userId;
	const review = await Review.create(req.body);

	res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
	const reviews = await Review.find({}).populate({
		path: "product",
		select: "name company price",
	}).populate({
		path: "user",
		select: "name",
	})
	res.status(StatusCodes.OK).json({ reviews });
};
const getSingleReview = async (req, res) => {
	const { id: reviewId } = req.params;
	const review = await Review.findOne({ _id: reviewId });
	if (!review) {
		throw new CustomeError.NotFoundError(`No review with id: ${reviewId}`);
	}
	
	res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
	const { id: reviewId } = req.params;
	const { reting, title, comment } = req.body;

	const review = await Review.findOne({ _id: reviewId });
	if (!review) {
		throw new CustomeError.NotFoundError(`NO review with id: ${reviewId}`);
	}

	checkPermission(req.user, review.user);

	if (!reting || !title || !comment) {
		throw new CustomeError.BadRequestError("please provide all values");
	}

	review.reting = reting;
	review.title = title;
	review.comment = comment;

	await review.save();
	res.status(StatusCodes.OK).send({ review });
};
const deleteReview = async (req, res) => {
	const { id: reviewId } = req.params;
	const review = await Review.findOne({ _id: reviewId });
	if (!review) {
		throw new CustomeError.NotFoundError(`No review with id: ${reviewId}`);
	}
	checkPermission(req.user, review.user);
	await review.remove();
	res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

const getSingleProductReviews = async(req,res) => {
	const { id: productId } = req.params;
	const reviews = await Review.find({ product: productId })
	res.status(StatusCodes.OK).json({reviews})
}

module.exports = {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
	getSingleProductReviews,
};
