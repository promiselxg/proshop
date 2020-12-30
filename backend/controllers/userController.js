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
  const users = await User.find({}).sort({ name: 1 }) // select and sort alphabetically by name
  res.json(users)
})

//  @desc  Delete user
//  @route  GET api/user/:id
//  @access Private/Admin
const deleteUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User Removed' })
  } else {
    res.status(404)
    throw new Error('User not Found')
  }
})

//  @desc  Get User by ID
//  @route  GET api/users/:id
//  @access Private/Admin
const getUserById = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not Found')
  }
})

//  @desc  Update User
//  @route  PUT api/users/:id
//  @access Private/Admin
const updateUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin
    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not Found')
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
