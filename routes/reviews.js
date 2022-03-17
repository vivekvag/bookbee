const {Book} = require('../models/books')
const express = require('express')
const router = express.Router()

// api to get reviews data of all books
router.get(`/`, async(req, res) => {
  const books = await Book.find({}).select('reviews -_id')
  if(!books){
    res.status(500).send('books collection is empty')
  }
  res.send(books)
})

module.exports = router