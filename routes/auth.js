const express = require('express')
const jwt = require('jsonwebtoken')
const { secret } = require('config')
const Joi = require('joi')
const authRoute = express.Router()
const { database } = require('../db/database')

const authMiddleware = (req, res, next) => {
  // Get Token from the header if present
  let token = req.headers['x-access-token'] || req.headers['authorization']
  // If no token found, return response
  if (!token) return res.status(401).send('Access denied. No token provided')

  token = token.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).send('Invalid token')
  }
}

// Sign In Validator
const validateSignIn = user => {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  }

  return Joi.validate(user, schema)
}
// Sign Up Route
authRoute.post('/register', authMiddleware, (req, res) => {
  const { username, password, role } = req.body

  // Check that all fields are required
  if (!username || !password || !role || typeof role !== 'object')
    return res.status(401).json({ message: 'All fields are required' })

  // Check if username already exist
  const checkUsername = database['users'].find(
    user => user.username === username.trim(),
  )
  if (checkUsername)
    return res.status(422).json({ message: 'Username already exist' })

  let user = {
    id: database['users'][database['users'].length - 1].id + 1,
    username: username.trim(),
    password: password,
    role: role,
  }

  database['users'].push(user)

  return res
    .status(201)
    .json({ message: 'User created successfully', data: user })
})

// Sign In Route
authRoute.post('/login', (req, res, next) => {
  const { username, password } = req.body
  // Ensure all fields are provided
  if (!username || !password) {
    return res.status(401).json({ message: 'All fields are required' })
  }

  // Try to sign in
  const user = database['users'].filter(
    user =>
      user.username === username.trim() && user.password === password.trim(),
  )[0]

  // Account not found
  if (!user || user.length < 1)
    return res.status(401).json({ message: 'Incorrect credentials' })

  // Account is valid, generate token and login user in
  const token = jwt.sign(
    { _id: user.id.toString(), username: user.username },
    secret,
  )

  return res.status(200).json({
    message: 'User signin successful',
    token: `Bearer ${token}`,
    data: user,
  })
})

module.exports = {
  authRoute,
  authMiddleware,
}
