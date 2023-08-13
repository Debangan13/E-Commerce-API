require("dotenv").config();
require('express-async-errors')

const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload')

// Security package
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

// routes
const authRouter = require('./routs/authRoute')
const userRouter = require('./routs/userRoute')
const productRouter = require('./routs/productRoute')
const reviewRouter = require('./routs/reviewRoute')
const orderRouter = require('./routs/orderRoute')

// database
const connecteDB = require("./db/connect");

// middleware 
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler');


// Security package setups
app.set('trust proxy', 1);
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 60
}))
app.use(helmet())
app.use(xss())
app.use(cors())
app.use(mongoSanitize())

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload())

app.get('/', (req, res) => {
    res.send('e-commerce api')
})
app.get('/api/v1', (req, res) => {
	// console.log(req.cookies)
	console.log(req.signedCookies)

    res.send('e-commerce api')
})

// route setups
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders', orderRouter)


// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connecteDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${port}`));
	} catch (error) {
		console.log(error.message);
	}
};

start();
