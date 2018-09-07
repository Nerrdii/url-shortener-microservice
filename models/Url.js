const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlSchema = new Schema({
  originalUrl: String
});

mongoose.model('urls', urlSchema);
