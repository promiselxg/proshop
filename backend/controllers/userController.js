import AsyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

//  @desc   Authenticate User & get Token
//  @route  POST api/users/login
//  @access Public
const authUser = AsyncHandler(async (req, res) => {
  // get data from form body
  const { email, password } = req.body

  const user = await User.findOne({ email })

  //    check if user exist and match password
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid Email or Password')
  }
})

//  @desc  Get User Profile
//  @route  GET api/users/profile
//  @access Private
const getUserProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not Found')
  }
})

//  @desc   Register a New User
//  @route  POST api/users
//  @access Public
const registerUser = AsyncHandler(async (req, res) => {
  // get data from form body
  const { name, email, password } = req.body

  // check if User exist
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already Exist')
  }
  // create new user
  const user = await User.create({
    name,
    email,
    password,
  })
  // check if user is created successfully
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Inavlid User Data')
  }
})

//  @desc  Update User Profile
//  @route  PUT api/users/profile
//  @access Private
const updateUserProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not Found')
  }
})

//  @desc  Get all users
//  @route  GET api/users
//  @access Private/Admin
const getUsers = AsyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password -__v')
  res.json(users)
})

export { authUser, getUserProfile, registerUser, updateUserProfile, getUsers }
