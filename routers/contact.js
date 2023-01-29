const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')


const Contact = require('../models/contact')


router.get('/contacts' , auth, async (req,res)=> {
    try{
        const contacts = await Contact.find({owner : req.user._id})
        res.status(201).send(contacts)
    }
    catch(e) {
        req.status(400).send(e)
    }
})

router.post('/contact', auth, async (req, res) => {

    const contact = new Contact({
        ...req.body,
        owner: req.user._id
    })

    try {
        await contact.save()
        res.status(201).send(contact)
    }
    catch(e) {{
        res.status(401).send(e)
    }}
})

router.patch('/contact/:id', auth , async (req,res) => {
    try {

        const contact = await Contact.findOneAndUpdate({_id: req.params.id, owner: req.user._id}, req.body, {new : true, runValidators:true})

        // const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators:true})
        if(!contact) {
            return res.status(404).send('Cannot find such a contact')
        }
        res.send(contact)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/contact/:id', auth, async (req,res) => {
    try {
        const contact = await Contact.findOneAndDelete({_id : req.params.id, owner : req.user._id})
        if(!contact) {
            return res.satus(404).send()
        }
        return res.send(contact)
    }catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router