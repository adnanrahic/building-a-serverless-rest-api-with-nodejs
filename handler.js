'use strict';

require('dotenv').config({ path: './variables.env' });
const mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useMongoClient: true });
mongoose.Promise = global.Promise;
const Note = mongoose.model('Note', { content: String });

module.exports.create = (event, context, callback) => {
  Note.create(JSON.parse(event.body))
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
  Note.findById(event.pathParameters.id)
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
  Note.find()
    .then(notes => callback(null, {
      statusCode: 200,
      body: JSON.stringify(notes)
    }))
    .catch(err => callback(null, {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the notes.'
    }));
};

module.exports.update = (event, context, callback) => {
  Note.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
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
  Note.findByIdAndRemove(event.pathParameters.id)
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