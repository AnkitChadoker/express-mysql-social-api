const mysql = require('mysql');

const connection = mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    password: "",
    database: "node-social-auth"
});

connection.connect( (err) => {
    if(err) 
        console.error(err)
    else
        console.log('database connected successfully.')
});

module.exports = connection;
