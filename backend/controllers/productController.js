import AsyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//  @desc   Fetch All Products
//  @route  GET api/products
//  @access Public
const getProducts = AsyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i', // incase sensitive
        },
      }
    : {}
  const products = await Product.find({ ...keyword })
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

//  @desc   Create Product
//  @route  POST api/products
//  @access Private/Admin
const createProduct = AsyncHandler(async (req, res) => {
  const product = new Product({
    name: 'sample data',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

//  @desc   Update a Product
//  @route  PUT api/products/:id
//  @access Private/Admin
const updateProduct = AsyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

//  @desc   Create new Review
//  @route  PUT api/products/:id/review
//  @access Private
const createProductReview = AsyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    //  check if user has already submitted a review
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already Reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review Added' })
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
}
