import express, { Application } from 'express'
import CardsController from './src/controllers/CardsController'

require('dotenv').config()

const PORT = process.env.PORT || 3000
const cors = require('cors')

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', CardsController.get)

app.listen(PORT, () => {
  console.log(`Listenning on port ${PORT}`)
})