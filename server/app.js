require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
  quiet: true,
  encoding: "utf8",
  debug: false,
});
const {create,read, updatetablesCols} = require('./lib/mysql.js');
// let reading = read('bookings')
// console.log(reading)
const express = require("express");
const app = express();
const port = process.env.PORT || 3033;
const path = require("path");
const cors = require("cors");
const { pool, testConnection } = require("./lib/db.js");
const fs = require("fs");
const fileupload = require("express-fileupload");
const { gzip, ungzip } = require("node-gzip");
const cookieSession = require("cookie-session");
const session = require("express-session");
const { emitWarning } = require("process");
const MySQLStore = require("express-mysql-session")(session);
const animals = ["dog", "cat", "rabbit", "turtle", "snake"];
const times = ["years", "months", "weeks"];
// approved file types`
const approvedFileTypes = ["jpeg", "jpg", "png"];
const measurements = {
  height: ["cm", "in"],
  weight: ["lbs", "kg"],
};
const sessionStoreOptions = {
  clearExpired: true, // Auto-clean expired sessions
  checkExpirationInterval: 900000, // How frequently to check for expired sessions (in ms)
  expiration: 86400000, // The maximum age of a session (in ms)
  endConnectionOnClose: true, // Close the connection when the store is closed
};
// Create the MySQL session store
const sessionStore = new MySQLStore(sessionStoreOptions, pool);
/*-------------------------------------------- */ /*-------------------------------------------- */
// middleware
app.use(
  session({
    secret: process.env.SESSIONKEY || "secret-key", // Used to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1800000,
      sameSite: "strict",
    }, // Use secure cookies in production
  })
);
// app.use(cookieSession({
//   name: 'session',
//   keys:['key1','key2'],
//   // Cookie Options
//   maxAge: 1800000,
//   secure:false,
// }))

app.use(cors());
app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(require("path").join(__dirname, "../public")));

/* --------destroy cookie ----------- */
// app.use(destroySession)
// function destroySession(req,res,next){
//     req.session = null;
//     next();
// }
/*-------------------------------------------- */ /*-------------------------------------------- */
// routes

// upload pet image

app.route('/tables/check').get((Req,res)=>{
  console.log('hello')
  updatetablesCols(['pets','owners','bookings'])
  res.json({data:'hello'})
})

app.route("/upload/pet").post(uploadPet);

//write booking to server
app.route("/book").post(async (req, res) => {

    // check if bookings folder exists
  if (!fs.existsSync(path.resolve(__dirname, "bookings"))) {
    // create bookings folder
    fs.mkdirSync(path.resolve(__dirname, "bookings"));
  }

  // get list of owners by id
  const ownerIdList = await getOwners(pool)
  // console.log(ownerIdList) // map of existing IDs
  const id = await generateId(ownerIdList);
  req.body.proof_of_vaccination = /(false|other)/.test(
    req.body.proof_of_vaccination
  )
    ? !!!req.body.proof_of_vaccination
    : !!req.body.proof_of_vaccination;
  req.body.quantity = +req.body.quantity;
 let formatDate = new Date(Date.now()).toLocaleDateString().split('/').map(x=>{
    x = Number(x);
    return x < 10 ? '0'+x : x
}).reverse().join`/`;


/*-----------------------------*/
    // make booking details obj
  let booking_details = {
    id,
    ...req.body,
    ...req.files,
    booking_time: Date.now(),
    booking_date: formatDate,
  };
/*-----------------------------*/


   // iterate through details object
  for (let i in booking_details) {
    let type = "type";
    let height = "select-input-height";
    let weight = "select-input-weight";
    let array = [type, height, weight];

    // iterate through the array of properties
    for (let j = 0; j < array.length; j++) {
      if (new RegExp(array[j], "gi").test(i)) {
        let val = +booking_details[i];
        let prop = "animal" + i;

        if (new RegExp(array[j], "gi").test(type)) {
          booking_details[prop] = animals[val];
        }
        if (new RegExp(array[j], "gi").test(height)) {
          let measurement = measurements.height[val];
          booking_details[prop] = measurement;
        }
        if (new RegExp(array[j], "gi").test(weight)) {
          let measurement = measurements.weight[val];
          booking_details[prop] = measurement;
        }
      }
    }
  }
  // console.log(booking_details);
  let formattedObj = splitDetailsByNum(booking_details);
  const payload = JSON.stringify([formattedObj]);
 
  // write formatted object to bookings folder
  let submission = 'submission'
  let formatDateSubmission = formatDate.split`/`.join`.`
  let formatCustomer = `${formattedObj.lname}${formattedObj.fname[0].toLowerCase()}`;
  let readBookingsDir = fs.readdirSync(path.resolve(__dirname,'bookings'),{encoding:"utf-8"});
  let similarBookings = [];
  let filePathToJSON = `${submission}.${formatDateSubmission}.${formatCustomer}.json`

    fs.writeFileSync(path.resolve(path.join(__dirname,'bookings',filePathToJSON)),payload,'utf-8')

    // pull json data from server (/bookings)
    const jsonFile = pullJsonData('bookings',filePathToJSON);
    console.log(jsonFile);

  // response in json format
  res.json(formattedObj);
});

// booking submission
app.route("/book/submission").get((req, res) => {
  const submission = require("path").join(
    __dirname,
    "../public",
    "submission.html"
  );
  // redirect to submission.html
  res.sendFile(submission);
});

// breed
// app.route('/breed').get((req,res)=>{
// // method
// })

// get breeds by animal param

// get breed by animal
app.route("/breed/:animal").get(async (req, res) => {
  let animals = ["dog", "cat", "rabbit", "turtle", "snake"];
  const { animal } = req.params;
  const directory = "lib/animals";
  try {
    // console.log(animals[animal]+"s")
    const readfile = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, directory, `${animals[animal] + "s"}.json`),
        { encoding: "utf-8" }
      )
    );
    if (!readfile) {
      // console.log("this is false")
    } else {
      // console.log("file has been read");
      res.json(readfile);
    }
  } catch (err) {
    throw new Error(err);
  }
});

// app.route('/rabbits/post').post((req,res)=>{
//     console.log(req.body)
//     const rabbitsDir = path.resolve(__dirname,'lib','rabbits.json')
//     // write to file
//     fs.writeFileSync(rabbitsDir,JSON.stringify(req.body),{encoding:'utf-8'})
//     res.json(req.body)
// })

// listen



/* --------------------------------listen on server------------------------------- */

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
/* --------------------------------listen on server------------------------------- */


/* --------------------------------page not found------------------------------- */
// 404
app.use((req, res) => {
  res.status(404).send("404 Page not found");
});
/* --------------------------------page not found------------------------------- */

// upload pet fn
async function uploadPet(req, res) {
  // upload pet image
  //  console.log(req.files);
  const maxKb = 75;
  let files = {};
  files = { ...req.files };
  let error;

  // for let i
//   let objectFiles = Object.keys(files);
  // for(let i = 0; i < objectFiles.length; i++){
  //     let current = files[objectFiles[i]];
  //     if(current){
  //         console.log(current.name)
  //         console.log(current.data)
  //     }

  //     fs.writeFileSync(path.resolve(__dirname,'output',current.name),current.data,'utf-8')
  // }

  // for prop in
  for (const prop in req.files) {
    let obj = {};
    // console.log(req.files[prop])
    if (req.files[prop].size <= maxKb * 1000) {
      if (
        approvedFileTypes.indexOf(req.files[prop].mimetype.split`/`[1]) !== -1
      ) {
        let compressed = await gzip(req.files[prop].data); // send to s3 bucket
        obj.gzip = compressed;
        // transfer file info to object
        obj.name = req.files[prop].name;
        obj.size = req.files[prop].size;
        obj.md5 = req.files[prop].md5;
        // test - send files to output dir
        // fs.writeFile(path.resolve(__dirname,'output',req.files[prop].name),req.files[prop].data,'utf-8',(err,done)=>{
        //     return err ? console.error(err) : done;
        // });
      } else {
        error = "File type is not approved";
      }
    } else {
      error = "file size is too large";
    }

    // console.log(obj);
  }

  try {
    return error ? res.send("error present.") : res.status(204).end();
  } catch (err) {
    throw new Error(err);
  }
}
async function getAllFrom(tablename, rowOrInfo, pool) {
  try {
    const response = await pool.query(`select * from ${tablename}`);
    // console.log(response[rowOrInfo]);
    return response[rowOrInfo];
  } catch (err) {
    throw new Error(err);
  }
}
async function generateId(list){
  let id = require('crypto').randomBytes(16).toString('hex').slice(-8);
  // const id = 'd938rn34frn'
  // const id = '2b8f7aad'
  try{
    if(!list.includes(id)){
      return id;
    } else {
       return generateId(list)
    }
  }
  catch(err){
    throw new Error(err)
  }
}
async function getOwners(pool){
  const currentOwners = await read('owners');
  const [rows,info] = [...currentOwners];
  const mapIds = [...rows].map(o => o['oid']);
  return mapIds
}

function splitDetailsByNum(details) {
  let nums = {};
  for (let i in details) {
    if (/[0-9]$/g.test(i)) {
      let matchNum = i.match(/\d$/g);
      // console.log(i,matchNum)
      !nums[matchNum[0]] ? (nums[matchNum[0]] = {}) : null; // instantiating new object {}
      nums[matchNum[0]][i] = details[i];
    }
    if (!/\d$/g.test(i)) {
      nums[i] = details[i];
    }
  }
  return nums;
}
function validateProperties(input,compare){
    compare = JSON.parse(compare);
    return compare.fname === input.fname && compare.lname === input.lname && compare.email === input.email
}
function storePet(jsonFile){
  for(let i in jsonFile){
    if(/^\d*$/.test(i)){
      console.log(jsonFile[i])
    }
  }
}
function storeOwner(jsonFile){
jsonFile = JSON.parse(jsonFile)[0];
console.log(jsonFile)
let payload = {}
// MIGRAGE OWNER INFORMATION FROM FILE TO PAYLOAD
payload.firstname = jsonFile.fname;
payload.lastname = jsonFile.lname;
payload.oid = jsonFile.id;
payload.phone = jsonFile.phone;
payload.email = jsonFile.email;

// INSERT DATA INTO OWNERS TABLE
create('owners',payload)
  // for(let i in jsonFile){
  //   if(!/^[0-9]*$/.test(i)){
  //     // console.log(jsonFile[i])
  //     console.log(i+" : " + jsonFile[i])
  //   } else {
  //     console.log('false store')
  //   }
  // }
}
// const submission = fs.readFileSync(path.resolve(__dirname,'bookings','submission.2025.10.08.loj.json'),'utf8');
// console.log(submission)
function storeBooking(jsonFile){
    // method to store booking
    return null;
}
function pullJsonData(directory,filename){
    let d,f,j;
    d = fs.readdirSync(path.resolve(__dirname,directory),'utf8');
    f = fs.readFileSync(path.resolve(__dirname,directory,filename),'utf8');
    j = JSON.parse(f);
    return j; // return array
}

// async function updateMysqlCols(req,res,next){
//   try{
//     let response = await updatetablesCols(['pets','owners','bookings'])
//     console.log(response)
//     next();
//   }
//   catch(err){
//     throw new Error(err)
//   }
// }
/* ---------- new Promise to resolve ---------- */
//  // resolve inner
//   let inner = new Promise(resolve => {
//     // resolve(read('pets'))
//     setTimeout(()=> resolve(read('pets')),1000)
//     // resolve(read('bookings'))
//   })

//   // resolve outer
//   let outter = new Promise(resolve => {
//       setTimeout(()=> resolve(inner),1000)
//   })

//   // then
//   const response = outter.then(value => {
//     // console.log(value)
//     console.log(value.information)
//     console.log("\n")
//     console.log(value.rows);
//     return value;
//   })

