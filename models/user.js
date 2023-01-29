const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Contact = require('./contact')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim : true,
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
    password : {
        type : String,
        required : true,
        minlength : 6,
        trim : true,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain the word "password" in it.')
            }
        }

    },
    tokens : [
        {token : {
            type : String,
            required : true
        }}
    ]
        
})


UserSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
       throw new Error('Unable to login!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {{
        throw new Error('Unable to login!')
    }}
    return user
}


UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'signatureforcontactkeeper')
    user.tokens = user.tokens.concat({token: token})
    await user.save()

    return token
}


UserSchema.virtual('contact', {
    ref : 'Contact',
    localField : '_id',
    foreignField : 'owner'
})


UserSchema.pre('remove', async function (next) {
    const user=this
    await Contact.deleteMany( { owner : user,_id})
    next()
})

const User = mongoose.model('User',UserSchema)

module.exports = User