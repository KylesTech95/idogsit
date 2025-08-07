require('dotenv').config({
    path:require('path').resolve(__dirname,'../.env')
})
const express = require('express')
const app = express()
const port = process.env.PORT||3033
const path = require('path')
const cors = require('cors')
const {pool, testConnection} = require('./lib/db.js')
const fs = require('fs');
const fileupload = require('express-fileupload');
const {gzip, ungzip} = require('node-gzip');
const cookieSession = require('cookie-session')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
const animals = ['dog','cat','rabbit','turtle','snake']
const times = ['years','months','weeks']
const measurements = {
    height:['cm','in'],
    weight:['lbs','kg'],
}
const sessionStoreOptions = {
    clearExpired: true, // Auto-clean expired sessions
    checkExpirationInterval: 900000, // How frequently to check for expired sessions (in ms)
    expiration: 86400000, // The maximum age of a session (in ms)
    endConnectionOnClose: true // Close the connection when the store is closed
}
// Create the MySQL session store
const sessionStore = new MySQLStore(sessionStoreOptions, pool);
/*-------------------------------------------- *//*-------------------------------------------- */
// middleware
app.use(session({
    secret: process.env.SESSIONKEY||'secret-key', // Used to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    store:sessionStore,
    cookie: { secure: false, httpOnly:true, maxAge:1800000, sameSite:'strict', } // Use secure cookies in production
}));
// app.use(cookieSession({
//   name: 'session',
//   keys:['key1','key2'],
//   // Cookie Options
//   maxAge: 1800000,
//   secure:false,
// }))

app.use(cors())
app.use(fileupload())
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static(require('path').join(__dirname,'../public')))

app.use((req,res,next)=>{
    console.log(req.session)
    next();
})
/* --------destroy cookie ----------- */
// app.use(destroySession)
// function destroySession(req,res,next){
//     req.session = null;
//     next();
// }
/*-------------------------------------------- *//*-------------------------------------------- */

// routes

// upload pet image
app.route('/upload/pet').post(uploadPet)

// book
app.route('/book').post(async(req,res)=>{
    // await getAllFrom('pets',0,pool);
    // await getAllFrom('owners',1,pool);
    const id = require('crypto').randomBytes(8).toString('hex').slice(-8)
    req.body.proof_of_vaccination = /(false|other)/.test(req.body.proof_of_vaccination) ? !!(!req.body.proof_of_vaccination) : !!(req.body.proof_of_vaccination)
    req.body.quantity = +(req.body.quantity);

    let booking_details = {
        id,
        ...req.body,
        ...req.files,
        booking_time:Date.now(),
        booking_date:new Date(Date.now()).toLocaleDateString(),
    }

    for(let i in booking_details){
        let type = 'type';
        let height = 'select-input-height';
        let weight = 'select-input-weight';
        let array = [type,height,weight]

        // iterate through the array of properties
        for(let j = 0; j < array.length; j++){
            if(new RegExp(array[j],'gi').test(i)){
            let val = +booking_details[i]
            let prop = 'animal'+i
            
            if(new RegExp(array[j],'gi').test(type)){
                booking_details[prop] = animals[val];
            }
            if(new RegExp(array[j],'gi').test(height)){
            let measurement = measurements.height[val];
            booking_details[prop] = measurement;
            }
            if(new RegExp(array[j],'gi').test(weight)){
            let measurement = measurements.weight[val];
            booking_details[prop] = measurement;
            }
        }
        }
    }
    console.log(booking_details)
    let booking_object = splitDetailsByNum(booking_details);
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

// get breed by animal
app.route('/breed/:animal').get(async(req,res)=>{
    let animals = ['dog','cat','rabbit','turtle','snake']
    const {animal} = req.params;
    const directory = 'lib/animals'
    try{
        // console.log(animals[animal]+"s")
        const readfile = JSON.parse(fs.readFileSync(path.resolve(__dirname,directory,`${animals[animal]+"s"}.json`),{encoding:'utf-8'}));
        if(!readfile){
            // console.log("this is false")
        } else {
            // console.log("file has been read");
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
    res.status(404).send('404 Page not found');
})

// approved file types
const approvedFileTypes = ['jpeg','jpg','png']

// upload pet fn
async function uploadPet(req,res){
 // upload pet image
//  console.log(req.files);
const maxKb = 75;
let files = {};
files = {...req.files};

// for let i
let objectFiles = Object.keys(files)
let error;
// for(let i = 0; i < objectFiles.length; i++){
//     let current = files[objectFiles[i]];
//     if(current){
//         console.log(current.name)
//         console.log(current.data)
//     }

//     fs.writeFileSync(path.resolve(__dirname,'output',current.name),current.data,'utf-8')
// }

// for prop in
for(const prop in req.files){
    let obj = {};
    // console.log(req.files[prop])
    if(req.files[prop].size <= (maxKb*1000)){
        if(approvedFileTypes.indexOf(req.files[prop].mimetype.split`/`[1]) !== -1){
            let compressed = await gzip(req.files[prop].data); // send to s3 bucket
            obj.gzip = compressed;
            // transfer file info to object
            obj.name = req.files[prop].name
            obj.size = req.files[prop].size
            obj.md5 = req.files[prop].md5
            // test - send files to output dir
            // fs.writeFile(path.resolve(__dirname,'output',req.files[prop].name),req.files[prop].data,'utf-8',(err,done)=>{
            //     return err ? console.error(err) : done;
            // });
        } else {
            error = 'File type is not approved'
        }
    } else {
        error = 'file size is too large'
    }

        console.log(obj)
}


try{
    return error ? res.send('error present.') : res.status(204).end();
}
catch(err){
    throw new Error(err)
}
}

async function getAllFrom(tablename,rowOrInfo,pool){
    try{
        const response = await pool.query(`select * from ${tablename}`);
        console.log(response[rowOrInfo])
        return response[rowOrInfo];
    }   
    catch(err){
        throw new Error(err)
    }
}

function splitDetailsByNum(details){
    let nums = {};
    for(let i in details){
        if(/\d$/g.test(i)){
            let matchNum = i.match(/\d$/g)
            nums[matchNum] = {};
        }
        if(!/\d$/g.test(i)){
            nums[i] = details[i]
        }
    }
    console.log(nums)
    return nums;
}