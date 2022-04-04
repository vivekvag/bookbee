const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  name: { type: String },
  rating: { type: Number, required: true },
  comment: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Book'
  }
});

const booksSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  stream: {
    type: String,
    default: 'engineering'
  },
  branch: {
    type: String,
    default: 'IT'
  },
  semester: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  bookName: {
    type: String,
    required: true
  },
  publisher: {
    type: String
  },
  authors: {
    type: String,
    required: true
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  image: {
    type: String,
    default: ''
  }
});

exports.Book = mongoose.model('Book', booksSchema);
