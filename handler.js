'use strict';

require('dotenv').config({ path: './variables.env' });
const bluebird = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = bluebird;
let cachedDb;
const Note = mongoose.model('Note', { content: String });
const Report = mongoose.model('Report', { content: String, env: String, createdAt: { type: Date, default: Date.now } });

function createReport(env) {
  Report.create({ content: 'Connection request', env: env });
}

function connectToDatabase() {
  if (cachedDb) {
    console.log('=> using cached database instance');
    createReport('using cached database instance');
    return Promise.resolve();
  }

  console.log('=> using new database instance');
  createReport('using new database instance');
  return mongoose.connect(process.env.DB, { useMongoClient: true })
    .then(db => { cachedDb = db; });
}

module.exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      Note.create(JSON.parse(event.body))
    )
    .then(note => callback(null, {
      statusCode: 200,
      body: JSON.stringify(note)
    }))
    .catch(err => callback(null, {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not create the note.'
    }));
}

module.exports.getOne = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      Note.findById(event.pathParameters.id)
    )
    .then(note => callback(null, {
      statusCode: 200,
      body: JSON.stringify(note)
    }))
    .catch(err => callback(null, {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the note.'
    }));
};

module.exports.getAll = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      Note.find()
    )
    .then(notes => callback(null, {
      statusCode: 200,
      body: JSON.stringify(notes)
    }))
    .catch(err => callback(null, {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the notes.'
    }))
};

module.exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      Note.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
    )
    .then(note => callback(null, {
      statusCode: 200,
      body: JSON.stringify(note)
    }))
    .catch(err => callback(null, {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the notes.'
    }));
};

module.exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      Note.findByIdAndRemove(event.pathParameters.id)
    )
    .then(note => callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Removed note with id: ' + note._id, note: note })
    }))
    .catch(err => callback(null, {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the notes.'
    }));
};