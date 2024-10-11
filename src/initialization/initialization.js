const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const swaggerSetup = require('~/routes/swagger')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Space2Study project API',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:8080'
      }
    ]
  },
  apis: ['~/routes/*.js']
}

const {
  config: { CLIENT_URL }
} = require('~/configs/config')
const router = require('~/routes')
const { createNotFoundError } = require('~/utils/errorsHelper')
const errorMiddleware = require('~/middlewares/error')

const initialization = (app) => {
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(
    cors({
      origin: process.env.NODE_ENV === 'development' ? true : CLIENT_URL,
      credentials: true,
      methods: 'GET, POST, PATCH, DELETE',
      allowedHeaders: 'Content-Type, Authorization'
    })
  )

  app.set('swaggerOptions', options)

  swaggerSetup(app)

  app.use('/', router)

  app.use((_req, _res, next) => {
    next(createNotFoundError())
  })

  app.use(errorMiddleware)
}

module.exports = initialization
