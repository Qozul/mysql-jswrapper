let mysql = require('mysql');

let con = null;

// Performs an SQL query and gives the result to a callback
function _query(sql, callback) {
  if(con == undefined || con == null) {
    throw "No connection to database.";
  } else {
    // This is asynchronos, the error and result is returned to the given callback
    con.query(sql, (err, result) => {
        return(callback(err, result));
    });
  }
}
// Performs an SQL query with multiple data and gives the result to a callback
function _queryMulti(sql, values, callback) {
  if(con == undefined || con == null) {
    throw "No connection to database.";
  } else {
    // This is asynchronos, the error and result is returned to the given callback
    con.query(sql, [values], (err, result) => {
        return(callback(err, result));
    });
  }
}

// These can be called by another js file
module.exports = {
  // Creates a new database
  createDatabase: function(host, user, password, databaseName, callback) {
    // Make a temporary connection without a database connection
    con = mysql.createConnection({
      host: host,
      user: user,
      password: password
    });
    // On connect, create the database and end the temp connection
    con.connect(err => {
      if(err) throw err;
      _query("CREATE DATABASE " + databaseName, callback);
      con.end();
      con = null;
    });
  }, // Connect database attempts to connect to the given database
  connectDatabase: function(host, user, password, databaseName) {
    con = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: databaseName
    });
    // Leave the connection open, must be closed for calling script to end
    con.connect(err => {
      if(err) throw err;
    });
  }, // Closes the current database connection
  disconnectDatabase: function() {
    if(con != undefined && con != null) {
      con.end();
      return true;
    } else {
      return false;
    }
  }, // Quick SQL CREATE TABLE method
  createTable: function(tableName, primaryKey, keys, callback) {
    _query("CREATE TABLE " + tableName + "(" + primaryKey + " PRIMARY KEY, " + keys + ")", callback);
  }, // Quick SQL INSERT INTO method
  insertInto: function(tableName, keys, values, callback) {
    _query("INSERT INTO " + tableName + "(" + keys + ") VALUES (" + values + ")", callback);
  }, // Quick SQL INSERT INTO method supporting multiple value input
  insertIntoMulti: function(tableName, keys, values, callback) {
    _queryMulti("INSERT INTO " + tableName + " (" + keys + ") VALUES ?", values, callback);
  }, // Quick SQL SELECT value FROM table method
  selectFrom: function(tableName, keys, callback) {
    _query("SELECT " + keys + " FROM " + tableName, callback);
  }, // Quick SQL SELECT value FROM table WHERE condition method
  selectFromWhere: function(tableName, keys, condition, callback) {
    _query("SELECT " + keys + " FROM " + tableName + " WHERE " + condition, callback);
  }, // Quick SQLDROP TABLE method
  dropTable: function(tableName, callback) {
    _query("DROP TABLE " + tableName, callback);
  }, // Open SQL query if this is preferred or an unsupported query is wanted
  query: function(sql, callback) {
    _query(sql, callback);
  }, // Open SQL multi value query if this is preferred or an unsupported query is wanted
  queryMulti: function(sql, values, callback) {
    _query(sql, values, callback);
  }
}
