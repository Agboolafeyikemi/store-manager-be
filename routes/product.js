const express = require('express')
const { authMiddleware } = require('./auth')
const { database } = require('../db/database')
const productRoute = express.Router()

// Get All products route
productRoute.get('/product', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'All products', data: database['products'] })
})

// Get Single Product
productRoute.get('/product/:id', authMiddleware, (req, res) => {
  const { id } = req.params
  if (!id || +id < 1)
    return res.status(404).json({ message: 'Pass a product id' })

  // Get single product from the database
  const productFound = database['products'].find(product => product.id === +id)

  // Check if product exist
  if (!productFound)
    return res.status(404).json({ message: 'Product does not exist' })

  res
    .status(200)
    .json({ message: 'Product fetch succesfully', data: productFound })
})

// Create Product Route
productRoute.post('/product/create', authMiddleware, (req, res) => {
  const { title, category, quantity, price } = req.body
  if (!title || !category || !quantity || !price) {
    return res.status(403).json({ message: 'All fields are required' })
  }

  //   Create new Product
  const product = {
    id: database['products'][database['products'].length - 1].id + 1,
    title,
    category,
    quantity,
    price,
  }

  // Push to the database
  database['products'].push(product)

  res.status(201).json({
    message: 'Product created successfully',
    data: database['products'],
  })
})

// Update Product Route
productRoute.put('/product/:id', authMiddleware, (req, res) => {
  const { id } = req.params
  if (!id || +id < 1)
    return res.status(404).json({ message: 'Provide a valid product id' })

  const { title, category, quantity, price } = req.body
  if (!title || !category || !quantity || !price)
    return res.status(401).json({ message: 'All fields are required' })

  // Get product
  const productIndex = database['products'].findIndex(prod => prod.id === +id)

  if (productIndex === -1)
    return res.status(404).json({ message: 'Product not found' })

  // Update Product
  database['products'][productIndex].title = title
  database['products'][productIndex].category = category
  database['products'][productIndex].quantity = quantity
  database['products'][productIndex].price = price

  res.status(200).json({
    message: 'Product successfully updated',
    data: database['products'],
  })
})

// delete product
productRoute.delete('/product/:id', authMiddleware, (req, res) => {
  const { id } = req.params
  // If Id is not provided or not a number
  if (!id || +id < 1)
    return res.status(401).json({ message: 'Provide product id' })
  // Get Index of product
  const productFound = database['products'].find(product => product.id === +id)

  if (!productFound)
    return res.status(403).json({ message: 'Product not found' })

  // Remove Product from the database
  database['products'] = database['products'].filter(
    product => product.id !== productFound.id,
  )

  res.status(200).json({
    message: 'Product deleted successfully',
    data: database['products'],
  })
})

module.exports = productRoute
