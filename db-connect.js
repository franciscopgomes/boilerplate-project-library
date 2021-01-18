const mongoose = require('mongoose');


const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => { console.log("Connection established"); });

const db = mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = db;