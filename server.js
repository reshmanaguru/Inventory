import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const apiRouter = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_PATH = path.join(__dirname, 'db.json')

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Inventory API running on http://localhost:${port}`)
  })

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && port < 3010) {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`)
      startServer(port + 1)
      return
    }

    throw error
  })
}

app.use(cors())
app.use(express.json({ limit: '2mb' }))

const readData = () => {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8')
  return JSON.parse(raw)
}

const writeData = (data) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

const getUserPayload = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
})

const isValidUser = (email, password) => {
  const { users } = readData()
  const user = users.find((item) => item.email === email && item.password === password)
  return user || null
}

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Inventory API is running' })
})

apiRouter.post('/signup', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' })
  }

  const data = readData()
  const exists = data.users.some((user) => user.email.toLowerCase() === email.toLowerCase())

  if (exists) {
    return res.status(409).json({ message: 'User already exists with this email.' })
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
  }

  data.users.push(newUser)
  writeData(data)

  return res.status(201).json({
    message: 'User created successfully',
    user: getUserPayload(newUser),
  })
})

apiRouter.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = isValidUser(email, password)

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  return res.json({
    message: 'Login successful',
    user: getUserPayload(user),
  })
})

apiRouter.get('/products', (req, res) => {
  const { products } = readData()
  return res.json(products)
})

apiRouter.get('/products/:id', (req, res) => {
  const { products } = readData()
  const product = products.find((item) => item.id === Number(req.params.id))

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' })
  }

  return res.json(product)
})

apiRouter.post('/products', (req, res) => {
  const { name, description, category, price, stock, image, favorite } = req.body

  if (!name || !description || !category || !image) {
    return res.status(400).json({ message: 'Name, description, category, and image are required.' })
  }

  const data = readData()
  const newProduct = {
    id: Date.now(),
    name,
    description,
    category,
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    image,
    favorite: Boolean(favorite),
  }

  data.products.push(newProduct)
  writeData(data)

  return res.status(201).json(newProduct)
})

apiRouter.put('/products/:id', (req, res) => {
  const data = readData()
  const index = data.products.findIndex((item) => item.id === Number(req.params.id))

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found.' })
  }

  const updatedProduct = {
    ...data.products[index],
    ...req.body,
    price: Number(req.body.price ?? data.products[index].price),
    stock: Number(req.body.stock ?? data.products[index].stock),
  }

  data.products[index] = updatedProduct
  writeData(data)

  return res.json(updatedProduct)
})

apiRouter.delete('/products/:id', (req, res) => {
  const data = readData()
  const products = data.products.filter((item) => item.id !== Number(req.params.id))

  if (products.length === data.products.length) {
    return res.status(404).json({ message: 'Product not found.' })
  }

  data.products = products
  writeData(data)

  return res.json({ message: 'Product deleted successfully.' })
})

app.use('/api', apiRouter)

startServer(Number(process.env.PORT) || 3002)
