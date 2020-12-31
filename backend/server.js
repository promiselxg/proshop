import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import path from 'path'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

// Connect to Database
connectDB()

//  Initialize Express Server
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is Running...')
})

//  Moute Routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// PAYPAL CLIENT ID
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

// make uploads folder static
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
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
