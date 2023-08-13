const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "name must not be blank"],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: [true, "email must not be blank"],
        validate: {
            validator: validator.isEmail,
            message: 'please provide valid email address'
        },
		unique: true
	},
	password: {
		type: String,
		required: [true, "password must not be blank"],
		minlength: 6,
	},
    role: {
        type: String,
        enum:['admin','user'],
        default: 'user'
    }
});

userSchema.pre('save',async function(next){
	// if(this.isModified('password')){
	// 	const salt = await bcrypt.genSalt(10)
	// 	this.password = await bcrypt.hash(this.password,salt)
	// }
	
	if(!this.isModified('password')) return
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password,salt)
	next()
})
	

userSchema.methods.comparePassword = async function(candidatePassword){
	const isMatch = await bcrypt.compare(candidatePassword,this.password)
	return isMatch
}

module.exports = mongoose.model("User", userSchema);