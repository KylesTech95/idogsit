require('dotenv').config({
    path:require('path').resolve(__dirname,'../.env')
})
const express = require('express')
const app = express()
const port = process.env.PORT||3033
const path = require('path')
const cors = require('cors')
const {pool} = require('./lib/db.js')
const fs = require('fs');

// app.use((req,res,next)=>{
//     // console.log(pool)
//     const current_path = req.path;
//     console.log(current_path)
//     next()
// })
/*-------------------------------------------- *//*-------------------------------------------- */
// middleware
app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static(require('path').join(__dirname,'../public')))
/*-------------------------------------------- *//*-------------------------------------------- */

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

// booking submission
app.route('/book/submission').get((req,res)=>{
        const submission = require('path').join(__dirname,'../public','submission.html')
        
        // redirect to submission.html
        res.sendFile(submission)
})

// breed
// app.route('/breed').get((req,res)=>{
// // method
// })

// get breeds by animal param

app.route('/breed/:animal').get(async(req,res)=>{
    let animals = ['dog','cat','rabbit','turtle','snake']
    const {animal} = req.params;
    const directory = 'lib/animals'
    try{
        console.log(animals[animal]+"s")
        const readfile = JSON.parse(fs.readFileSync(path.resolve(__dirname,directory,`${animals[animal]+"s"}.json`),{encoding:'utf-8'}));
        if(!readfile){
            console.log("this is false")
        } else {
            console.log("file has been read");
            res.json(readfile)
        }   
    }
    catch(err){
        throw new Error(err);
    }
})

// app.route('/rabbits/post').post((req,res)=>{
//     console.log(req.body)
//     const rabbitsDir = path.resolve(__dirname,'lib','rabbits.json')
//     // write to file
//     fs.writeFileSync(rabbitsDir,JSON.stringify(req.body),{encoding:'utf-8'})
//     res.json(req.body)
// })

// listen

app.listen(port,()=>{
    console.log("Server is running on port " + port)
})

// 404
app.use((req,res)=>{
    res.status(404).send('404 Page not found')
})