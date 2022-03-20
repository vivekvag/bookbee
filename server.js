const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

require('dotenv/config')
const api = process.env.API_URL

const usersRoute = require('./routes/users')
const booksRoute = require('./routes/books')


// middlewares
app.use(express.json());
app.use(morgan('tiny'));
app.use(`${api}/users`,usersRoute)
app.use(`${api}/books`,booksRoute)
app.use(`/public/uploads`,express.static(__dirname + '/public/uploads'))



mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'bookbee'
})
.then(() => {
  console.log('database connected successfully')
})
.catch((err) => {
  console.log(err);
})

app.listen(3000, () => {
  console.log(api);
  console.log('server is running http://localhost:3000');
})