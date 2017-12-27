'use strict';

const mongoose = require('mongoose');
mongoose.connect('mongodb://MONGODB_URI:27017/db', { useMongoClient: true });
mongoose.Promise = global.Promise;
const Note = mongoose.model('Note', { content: String });

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const params = {
    content: data.content
  };

  Note.create(params)
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
  const id = event.pathParameters.id;

  Note.findById(id)
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
  const data = JSON.parse(event.body);
  Note.findByIdAndUpdate(event.pathParameters.id, data, { new: true })
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