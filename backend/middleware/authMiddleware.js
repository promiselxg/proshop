import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import AsyncHandler from 'express-async-handler'

// protect routes from NOT logged in users
const protect = AsyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // return user data from DB except the password ('-password')
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not Authorized, Token Failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not Authorized as an Admin')
  }
}
export { protect, admin }
