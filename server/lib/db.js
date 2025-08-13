require('dotenv').config()
const mysql = require('mysql2/promise');
const dump = require('mysqldump')
const dumpToFile = require('path').resolve(__dirname,'dogsit.sql')
// connection
const connection = {
    host:process.env.MYSQL_H,
    user:process.env.MYSQL_U,
    password:process.env.MYSQL_P,
    database:process.env.MYSQL_D,
    port:process.env.MYSQL_PO
}
// pool the database
const pool = mysql.createPool(connection)
const exitProcess = (code) => require('process').exit(code); // exit process 1


const testConnection = async pool => {
    try { console.log([...await pool.query('select * from pets')][0]); exitProcess(0) } catch (err) { throw new Error(err); }
}



/* ----------------------------------- Dump Mysql ----------------------------------- */
// dump mysql database to .sql file
// function dumpMysqlToLib(connection,filepath){
//     // dump file
//     dump({
//         connection,
//         filepath
//     })
//     .then((data)=>{
//         console.log(data)
//         const dataString = JSON.stringify(data)
//         console.log('Database dumped successfully to ' + filepath);
//     })
//     .catch((err=>{
//         return err ? console.error('Error Dumping daabse:',err) : null;
//     }))
// }
// if(process.argv[process.argv.length-1] === 'dump'){
//     dumpMysqlToLib(connection,dumpToFile) // dumpToFile property should get passed as a varibale to match the object's [dump] property
// }
/* ----------------------------------- Dump Mysql ----------------------------------- */



module.exports = {pool, testConnection}


