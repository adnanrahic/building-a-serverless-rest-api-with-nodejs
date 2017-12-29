const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let isConnected;
const createReport = require('./helpers/createReport');

function connectToDatabase() {
  if (isConnected) { // finish this
    console.log('=> using existing database connection');
    createReport('using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  createReport('using new database connection');
  return mongoose.connect(process.env.DB, { useMongoClient: true })
    .then(db => { 
      isConnected = db.readyState;
    });
}

module.exports = connectToDatabase;