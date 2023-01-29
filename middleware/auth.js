const User = require('../models/user')
const jwt = require('jsonwebtoken')


const auth = async (req,res,next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'signatureforcontactkeeper')


        const user = await User.findOne({_id:decoded._id, 'tokens.token' : token})


        if(!user) {
            throw new Error('Not able to login')
        }

        req.user = user
        req.token=token
        next()
    }catch(e) {
        res.status(404).send({error : 'Please Authenticate'})
    }
}

module.exports=auth