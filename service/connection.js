const mysql = require('mysql');

var connection = mysql.createConnection({
  host: '211.253.10.145',
  port: 3306,
  user: 'root',
  password: 'apekf',
  database: 'gmedal'
});

connection.connect();

module.exports = connection;
