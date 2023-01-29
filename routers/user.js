const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

const User = require('../models/user')

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

//create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        
        const token = await user.generateAuthToken()

        await user.save()
        res.status(201).send('You are now registered')
    }
    catch(e) {
        res.status(400).send(e)
        console.log(e)
    }
})


// router.delete('/user/:id', async (req,res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user) {
//             return res.satus(404).send()
//         }
//         return res.send(user)
//     }catch(e) {
//         res.status(500).send(e)
//     }
// })


router.delete('/user/me', auth, async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id)
        if(!user) {
            return res.satus(404).send()
        }
        return res.send(user)
    }catch(e) {
        res.status(500).send(e)
    }
})



router.post('/user/login', async(req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e) {{
        res.status(400).send(e)
    }}
})


router.get('/user/me', auth, async(req,res) => {
    res.send(req.user)
})


router.post('/user/logout', auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token!=req.token
        })

        await req.user.save()
        res.send('You are logged OUT!')
    }catch(e) {
        res.status(500).send(e)
    } 
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token!=req.token
        })

        await req.user.save()
        res.send()
    }catch(e) {
        res.status(500).send()
    }
    
})

router.post('/user/logoutall', auth, async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e) {
        res.status(500).send(e)
    }
})


module.exports = router