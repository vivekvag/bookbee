const {User} = require('../models/users')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv/config')

// posting new users
router.post('/', async(req, res) => {
  let user = new User({
    name: req.body.name,
    username: req.body.username,
    isAdmin: req.body.isAdmin,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    stream: req.body.stream,
    branch: req.body.branch,
    semester: req.body.semester
  })
  
  user = await user.save()
  if(!user){
    return res.status(404).send('sorry the user can not be created')
  }
  res.send(user)
})

// getting all users data from the database
router.get(`/`,async (req, res) => {
  const userList = await User.find().select('-passwordHash');

  if(!userList){
    res.status(500).json({success: false})
  }
  res.send(userList)
})

// getting a specific user data from the database
router.get(`/:id`,async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if(!user){
    res.status(500).json({message: 'given user id does not exist'})
  }
  res.send(user)
})

// updating the user data if he/she wants to
router.put('/:id', async (req,res)=>{
  const userExists = await User.findById(req.params.id)
  let newPassword
  if(req.body.password){
    newPassword = bcrypt.hashSync(req.body.password,10)
  }else{
    newPassword = userExists.passwordHash
  }
  const user = await User.findByIdAndUpdate(req.params.id,{
    name: req.body.name,
    username: req.body.username,
    isAdmin: req.body.isAdmin,
    email: req.body.email,
    passwordHash: newPassword,
    stream: req.body.stream,
    branch: req.body.branch,
    semester: req.body.semester
  },
  {new: true})
  if(!user){
    return res.status(400).send('the user can not be updated')
  }
  res.send(category);
})

// login 
router.post(`/login`,async(req,res) => {
  const user = await User.findOne({email:req.body.email})
  if(!user){
    return res.status(400).send('the user not found')
  }
  if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
    const token = generateToken(user._id)
    res.status(200).send({user: user.email, token: token})
  }else{
    res.status(400).send('wrong credentials')
  }
})

// function to generate the jwt token for authorisation
const generateToken = (id) => {
  const secretKey = process.env.JWT_SECRET
  return jwt.sign({id},
    secretKey,
    {
      expiresIn:'7d'
    })
}

module.exports = router