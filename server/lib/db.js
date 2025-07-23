require('dotenv').config()
const mysql = require('mysql2');

const pool = mysql.createPool({
    host:process.env.MYSQL_H,
    user:process.env.MYSQL_U,
    password:process.env.MYSQL_P,
    database:process.env.MYSQL_D,
    port:process.env.MYSQL_PO
})

module.exports = {pool}