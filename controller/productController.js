const Product = require("../models/productSchema");
const { StatusCodes } = require("http-status-codes");
const CustomeError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
	req.body.user = req.user.userId;
	const product = await Product.create(req.body);
	res.status(StatusCodes.CREATED).json({ product });
};

const getAllProduct = async (req, res) => {
	const product = await Product.find({});
	res.status(StatusCodes.OK).json({ product });
};

const getSingleProduct = async (req, res) => {
	const { id: productId } = req.params;
	const product = await Product.findOne({ _id: productId }).populate('reviews');
	if (!product) {
		throw new CustomeError.NotFoundError(
			`No product found with id ${productId}`
		);
	}
	res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
	const { id: productId } = req.params;

	const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
		new: true,
		runValidators: true,
	});

	if (!product) {
		throw new CustomeError.NotFoundError(
			`No product found with id ${productId}`
		);
	}

	res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
	const { id: productId } = req.params;

	const product = await Product.findOne({});

	if (!product) {
		throw new CustomeError.NotFoundError(
			`No product found with id ${productId}`
		);
	}
	await product.remove()
	res.status(StatusCodes.OK).json({msg:"success! product removed"});
};

const uploadImage = async (req, res) => {
	if(!req.files){
		throw new CustomeError.BadRequestError('No files to upload')
	}

	const productImage = req.files.image
	if(!productImage.mimetype.startsWith('image')){
		throw new CustomeError.BadRequestError('Please Upload Image')
	}
	const mazSize = 1024 * 1024
	if(productImage.size > mazSize){
		new CustomeError.BadRequestError('Please upload image size smaller than 1mb')
	}
	const imagePath = path.join(__dirname,'../public/uploads/'+`${productImage.name}`)
	await productImage.mv(imagePath)
	res.status(StatusCodes.OK).json({image:`uploads/${productImage.name}`})
};

module.exports = {
	getAllProduct,
	getSingleProduct,
	updateProduct,
	createProduct,
	deleteProduct,
	uploadImage,
};
