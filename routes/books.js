const {Book} = require('../models/books')
const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')
const multer = require('multer')
// mime type to check uploaded image extension 
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

// required code for image uploading 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('invalid image type')
    if(isValid){
      uploadError = null
    }
    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })

// api to post books general data
router.post('/',uploadOptions.single('image'),async(req, res) => {
    const file = req.file
    if(!file){
      return res.status(400).send('No image in the request')
    }
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
    let book = new Book({
      user: req.body.user,
      stream: req.body.stream,
      semester: req.body.semester,
      subject: req.body.subject,
      bookName: req.body.bookName,
      authors: req.body.authors,
      publisher: req.body.publisher,
      image: `${basePath}${fileName}`,
      branch: req.body.branch 
    })
    book = await book.save()
    if(!book){
      return res.status(404).send('sorry the book can not be posted')
    }
    res.send('book inserted')
})

// api to get info of all books
router.get('/',async(req, res) => {
  const books = await Book.find()
  if(!books){
    res.status(500).send('books collection is empty')
  }
  res.send(books)
})

// api to get info of books of a particular semester
router.get('/semester',async(req, res)=>{
  const books = await Book.find({semester: req.body.semester})
  if(!books){
    res.status(500).send('that particular semester books collection is empty')
  }
  res.send(books)
})


// api to get reviews data of all books
router.get('/reviews', async(req, res) => {
  const books = await Book.find({}).select('reviews -_id')
  if(!books){
    res.status(500).send('books collection is empty')
  }
  res.send(books)
})

//api to get books data of a particular subject
router.get('/subject',async(req, res)=>{
  const books = await Book.find({subject: req.body.subject})
  if(!books){
    res.status(500).send('that particular subjects books collection is empty')
  }
  res.send(books)
})

// api to sort the books according to their ratings and display them
router.get('/semAndSubject',async(req,res)=>{
  const books = await Book.find({semester: req.body.semester,subject: req.body.subject}).select('bookName authors publisher reviews rating image -_id').sort({rating:'desc'})
  if(!books){
    res.status(500).send('Data is not present for this input')
  }
  res.send(books)
})


// -- jitni bhi get requests bina id ki hai woh iske upar daalo
// api to get info of a specific book
router.get(`/:id`, async(req,res) => {
  const book = await Book.findById(req.params.id)
  if(!book){
    res.status(500).send('this book is not present in our database')
  }
  res.send(book)
})

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

    if(req.body.rating < 1){
      throw new Error('Give a rating between 1 and 5')
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






module.exports = router