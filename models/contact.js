const mongoose = require('mongoose')
const validator = require('validator')

const ContactSchmema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim : true
    }, 
    phone : {
        type : Number,
        required : true,
        trim : true
    },
    email : {
        type: String,
        unique : true,          //ensures there isn't multiple users with same email
        required : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('It is not a valid mail id.')
            }
        }
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User',
    },
})


const Contact = mongoose.model('Contact', ContactSchmema)

module.exports = Contact