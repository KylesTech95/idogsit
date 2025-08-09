require('dotenv').config()
const mysql = require('mysql2/promise');
// db object


const pool = mysql.createPool({
    host:process.env.MYSQL_H,
    user:process.env.MYSQL_U,
    password:process.env.MYSQL_P,
    database:process.env.MYSQL_D,
    port:process.env.MYSQL_PO
})

const exitProcess = (code) => require('process').exit(code);




// functions
const testConnection = async pool => {try { console.log([...await pool.query('select * from pets')][0]); exitProcess(0) } catch (err) { throw new Error(err); }
}
// testConnection(pool)
module.exports = {pool, testConnection}


