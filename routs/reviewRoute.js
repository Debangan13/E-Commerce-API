const express = require("express");
const router = express.Router();

const {
	authenticateUser,
} = require("../middleware/authentication");

const {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
} = require("../controller/reviewController");

router
    .route("/")
    .post(authenticateUser,createReview)
    .get(authenticateUser,getAllReviews);

router
	.route("/:id")
	.patch(authenticateUser,updateReview)
	.delete(authenticateUser,deleteReview)
	.get(authenticateUser,getSingleReview);

module.exports = router;
