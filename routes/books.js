const {Book} = require('../models/books')
const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')

// api to post books general data
router.post('/',async(req, res) => {
    let book = new Book({
      user: req.body.user,
      stream: req.body.stream,
      branch: req.body.branch,
      semester: req.body.semester,
      subject: req.body.subject,
      bookName: req.body.bookName,
      publisher: req.body.publisher,
      authors: req.body.authors
    })
    book = await book.save()
    if(!book){
      return res.status(404).send('sorry the book can not be posted')
    }
    res.send(book)
})

// api to get info of all books
router.route('/').get(async(req, res) => {
  const books = await Book.find()
  if(!books){
    res.status(500).send('books collection is empty')
  }
  res.send(books)
})

// api to get info of a specific book
router.get(`/:id`, async(req,res) => {
  const book = await Book.findById(req.params.id)
  if(!book){
    res.status(500).send('this book is not present in our database')
  }
  res.send(book)
})

// router.route('/semesters').get(async(req, res) => {
//   const books = await Book.findOne({semester:req.body.semester})
//   if(!books){
//     res.status(500).send('books collection is empty')
//   }
//   res.send(books)
// })

// api to delete a specific book's data
router.delete(`/:id`, async(req, res) => {
  Book.findByIdAndRemove(req.params.id).then(book => {
    if(book){
      return res.status(200).json({success: true, message: 'book deleted successfully'})
    }else{
      return res.status(404).json({success: false, message: 'book not found'})
    }
  }).catch(err=>{
    return res.status(400).json({success: false, error: err})
  })
})

// api to review books and find avg rating
router.post(`/:id/reviews`, checkAuth, async(req, res) => {
  const { rating, comment } = req.body

  const book = await Book.findById(req.params.id)

  if (book) {
    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Book already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      book: book._id
    }

    book.reviews.push(review)

    book.numReviews = book.reviews.length

    book.rating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length

    await book.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Book not found')
  }
})

// api to get reviews data of all books
// router.route('/reviews').get(async(req, res) => {
//   const books = await Book.find({}).select('reviews -_id')
//   if(!books){
//     res.status(500).send('books collection is empty')
//   }
//   res.send(books)
// })

module.exports = router