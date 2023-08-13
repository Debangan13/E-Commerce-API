const express = require("express");
const router = express.Router();
const {
	authenticateUser,
	authorizePermissions,
} = require("../middleware/authentication");

const {
	getAllProduct,
	getSingleProduct,
	updateProduct,
	createProduct,
	deleteProduct,
	uploadImage,
} = require("../controller/productController");

const { getSingleProductReviews } = require("../controller/reviewController");

router
	.route("/")
	.get(getAllProduct)
	.post([authenticateUser, authorizePermissions("admin")], createProduct);

router.post(
	"/uploadImage",
	[authenticateUser, authorizePermissions("admin")],
	uploadImage
);

router
	.route("/:id")
	.patch([authenticateUser, authorizePermissions("admin")], updateProduct)
	.delete([authenticateUser, authorizePermissions("admin")], deleteProduct)
	.get(getSingleProduct);

router.route('/:id/reviews').get(getSingleProductReviews)

module.exports = router;
