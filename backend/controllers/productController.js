import AsyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//  @desc   Fetch All Products
//  @route  GET api/products
//  @access Public
const getProducts = AsyncHandler(async (req, res) => {
  const products = await Product.find({})
  res.json(products)
})

//  @desc   Fetch a single Product
//  @route  GET api/products/:id
//  @access Public
const getProductById = AsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not Found')
  }
})

//  @desc   Delete Product
//  @route  DELETE api/products/:id
//  @access Private/Admin
const deleteProduct = AsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  // req.user._id === product.user._id (if u want admin to only delete product created by Him)
  if (product) {
    await product.remove()
    res.json({ message: 'Product Removed' })
  } else {
    res.status(404)
    throw new Error('Product not Found')
  }
})

export { getProducts, getProductById, deleteProduct }
