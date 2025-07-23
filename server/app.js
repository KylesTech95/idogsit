require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT|3033
const cors = require('cors')
const {pool} = require('./lib/db.js')

app.use((req,res,next)=>{
    console.log(pool)

    next()
})
// middleware
app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static(require('path').join(__dirname,'../public')))


// routes

// schedule/book
app.route('/book').post((req,res)=>{
    const id = require('crypto').randomBytes(8).toString('hex').slice(-8)
    let vaccination_status = req.body.proof_of_vaccination;
    req.body.proof_of_vaccination = /(false|other)/.test(req.body.proof_of_vaccination) ? !!(!req.body.proof_of_vaccination) : !!(req.body.proof_of_vaccination)
    req.body.quantity = +(req.body.quantity)
    const booking_details = {
        id,
        vaccination_status,
        ...req.body,
        booking_time:Date.now(),
        booking_date:new Date(Date.now()).toLocaleDateString(),
    }
    console.log(booking_details)

    // res.send(booking_details)
    const submission = require('path').join(__dirname,'../public','submission.html')
        
        // redirect to submission.html
        // res.redirect(submission)
        res.json(booking_details)
})

app.route('/book/submission').get((req,res)=>{
        const submission = require('path').join(__dirname,'../public','submission.html')
        
        // redirect to submission.html
        res.sendFile(submission)
})


// listen
app.listen(port,()=>{
    console.log("Server is running...")
})