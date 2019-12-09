const mysql =require('mysql');
const conection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'root',
    database: 'villes'
});

module.exports = conection;