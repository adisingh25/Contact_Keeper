const express = require('express')
const bodyParser = require("body-parser")
require('./db/mongoose')

const userRouter = require('./routers/user')
const contactRouter = require('./routers/contact')



const app = express()
app.use(express.json())
app.use(userRouter)
app.use(contactRouter)

app.use(bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
}))
const port = 4000




app.listen(port, ()=> {
    console.log('Connected to port ', port)
})