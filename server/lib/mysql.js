const { pool } = require("./db.js");
const fs = require("fs");
const path = require("path");
const { tables } = require("./tables.json");
// console.log(tables)
// mysql database class
class Mysql {
  constructor(table, args) {
    this.table = table;
    this.args = args;
  }
  async create() {
    // store args into params variable
    let params = this.args;
    console.log("ARGUMENTS")
    console.log(this.args)
    let [keys, values] = [Object.keys(params), Object.values(params)];

    // query
    console.log("pool query Begin...");
    // pool the database and insert data with params
    await pool.query(
      `insert into ${this.table}(${keys.join`,`}) values(${new Array(
        values.length
      )
        .fill("?")
        .join(",")});`,
      values
    );
    console.log("pool query complete.");
    // require("process").exit(1);
  }
  async read() {
    // query
    // console.log("pool query Begin...");
    // pool the database and insert data with params
    const query = await pool.query(`SELECT * from ${this.table}`);
    // console.log("\n")
    // console.log(query[0])
    // console.log("pool query complete.");
    // require("process").exit(1);
    const [rows, information] = [...query];
    // return query
    return query;
  }

  async update() {
    return null;
  }
  async delete() {
    return null;
  }

  // special functions
  // join tables
  async join(idx) {
    idx = Number(idx);
    let direction =
      idx < 3 && idx >= 0 ? ["left", "inner", "right"][idx] : "invalid";
    // console.log(direction)
    return null;
  }
  err(message) {
    return message;
  }
}
/* ------------------------------------------------------------------ */

// create
/* ---------------------- create ---------------------- */
function create(table, args = {}) {
  let istrue = false; // boolean - if true, move to try/catch
  // switch table columns/values based on table {}
  switch (true) {
    case tables.hasOwnProperty(table):
      let keys = Object.keys(args);

      // check if every property/column in included in table
      if (keys.every((x) => tables[table].hasOwnProperty(x))) {
        istrue = true;
        console.log("all keys are within the object");
        // migrate data from args to tables[table];
        tables[table] = args;
      } else {
        istrue = false;
        let notFound = keys.filter((key) => !tables[table].hasOwnProperty(key));
        if (notFound) {
          console.error(
            `\n/*-----------Error--------------*/\n\nCurrent Table: ${table}\nInvalid propert${
              notFound.length > 1 ? "ies" : "y"
            }:${
              "\n" + new Array("invalid properties".length).fill("_").join("")
            }\n${
              notFound.length > 1 ? notFound.join("\n") : notFound
            }\n\n/*-----------Error--------------*/\n`
          );
        }
      }
      break;

    default:
      console.log(undefined);
      break;
  }

  // try/catch
  try {
    // call from Mysql class
    const mysql = new Mysql(table, tables[table]); // instantiate Mysql class and store in variable
    // if mysql exists and verification is true
    if (mysql && istrue) {
      mysql.create(); // create/insert row into table
    } else {
      // something went wrong
      errMessage = "Check Mysql Object";
      console.error("Something went wrong..." + mysql.err(errMessage));
    }
  } catch (err) {
    throw new Error(err);
  }
}
// true positive
// create('pets',{name:'shayla',age:1,height:12.5,weight:20,breed:'small-breed'});
// create('owners',{firstname:'Liam',lastname:'shade',phone:'123-343-1223'});
// create('bookings',{pid:2,oid:3,booking_date:'2025-10-20','booking_time':'04:33:04'});

// true negative
// create('pets',{lname:'Liam',fname:'shade',phone:'123-343-1223'});
// create('owners',{firstname:'Kenny',sirname:'stocks',phone:'232-343-3343'});
// create('bookings',{pid:'Liam',dsp:'shade',booking_date:'2025-03-04',time_booking:'12:33:33'});

/* ---------------------- read ---------------------- */
async function read(table, args = {}) {
  let istrue = false; // boolean - if true, move to try/catch
  // switch table columns/values based on table {}
  let mysql = new Mysql(table, undefined);

  console.log(tables)

  if (tables.hasOwnProperty(table)) {
    const obj = await mysql.read();
    // console.log("RUN READ FN")
    // console.log(obj)
    return obj;
  } else {
    console.error("Something went wrong..." + mysql.err(errMessage));
  }
}
// let newObject = new Mysql('table',[1,2,3]);
// newObject.read(newObject.join(process.argv.slice(-1)[0]||6));

/* ---------------------- update ---------------------- */
// update tables.json
async function updatetablesCols(arr) {
  // console.log("UPDATE COLS IN MYSQL")
  const describe = async (table) => await describeTable(table);
  // map props helper function
  const mapProperties = (array_var) => array_var.map((x) => x["Field"]);

  /* ----------Process - update tables after scanning the database and write to tables.json ----------- */
  let tables = {};
  // console.log("ITERATION");
  // map the array
  for (let i = 0; i < arr.length; i++) {
    const pets = arr[i]; // capture pets
    tables[pets] = {};
    let describeItem = await describe(pets);
    let describeProps = mapProperties(describeItem[0]);
    // console.log(describeProps);

    let rows = [...describeProps];
    // let rows = await read(arr[i])

    // iterate through the rows
    for (let j = 0; j < rows.length; j++) {
        let array = rows[j];
        // console.log(array)
        tables[pets][array] = "";
    }
  }

  /* setup parent property for tables */
  let parentProperty = 'tables'
  let oj = {} // instantiate new object
  oj[parentProperty] = {}; // set parent property in new object
  oj[parentProperty] = tables; // insert current object (tables) in parent;
  
  // writefilesync
  fs.writeFileSync(
    path.resolve(__dirname, "tables.json"),
    JSON.stringify(oj),
    "utf8"
  );
  return null;
}
// describe table
async function describeTable(table) {
  const query = await pool.query(`describe ${table}`);
  return query;
}
async function getTables(schema){
  const query = await pool.query(`select table_name from information_schema.key_column_usage where table_schema = '${schema}' and table_name != 'sessions'`);
  // console.log(query)
  // console.log(query[0])
  // console.log([...query[0]].map(obj=>obj.TABLE_NAME))
  return [...query[0]].map(obj=>obj.TABLE_NAME) // object of tables
}
/* ---------------------- delete ---------------------- */
// updatetablesCols(['pets','owners','book ings'])

module.exports = { create, read, updatetablesCols, getTables };


// problem:
// phone isnt captured when storing owner