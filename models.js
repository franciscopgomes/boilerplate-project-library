const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {type, String, required:true},
    comments: {type: [String], default: []}
}) 

const BOOK = mongoose.model("BOOK", bookSchema);