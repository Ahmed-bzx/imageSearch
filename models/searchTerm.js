const mongoose = require('mongoose');

const searchTermSchema = mongoose.Schema({
  term: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const SearchTerm = module.exports = mongoose.model('SearchTerm', searchTermSchema);
