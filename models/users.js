const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true,
    unique: true
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  passwordHash:{
    type: String,
    required: true,
    unique: true
  },
  stream:{
    type: String
  },
  branch:{
    type: String
  },
  semester:{
    type: Number
  }
})

exports.User = mongoose.model('User',usersSchema)