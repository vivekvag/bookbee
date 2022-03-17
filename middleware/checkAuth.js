const jwt = require('jsonwebtoken')
const { User } = require('../models/users')
require('dotenv/config')
module.exports = async (req,res,next) => {
  try{
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedToken.id).select('-passwordHash')
    next()
  }catch(err){
    return res.status(401).json({
      message: 'You are not Authorised for this service'
    })
  }
}