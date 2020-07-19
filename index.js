const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { authRoute } = require('./routes/auth')
const productRoute = require('./routes/product')

// Create Express Instance
const app = express()

// attach body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// use cors
app.use(cors())

// Routes
app.use(authRoute)
app.use(productRoute)

// Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to Store Manager Api')
})

// SET PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`)
})
