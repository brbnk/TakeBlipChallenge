import express, { Application } from 'express'
import CardsController from './src/controllers/CardsController'

require('dotenv').config()

const { PORT } = process.env
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', CardsController.get)

app.listen(PORT, () => {
  console.log('Listenning on port 3000')
})