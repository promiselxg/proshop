import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
dotenv.config()

// Connect to Database
connectDB()

//  Initialize Express Server
const app = express()

app.get('/', (req, res) => {
  res.send('API is Running...')
})

//  Moute Routes
app.use('/api/products', productRoutes)

//  Error Handler - File not Found
app.use(notFound)
//  Error Handler
app.use(errorHandler)

//  Listen to Server Connection
const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.bold
  )
)
