const logger = require('./logger')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  request.token = authorization && authorization.startsWith('Bearer ')
    ? authorization.substring(7)
    : null
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = await jwt.verify(
    request.token,
    config.SECRET
  )

  if (!decodedToken.id) {
    return response
      .status(401)
      .json({
        error: 'token with no id'
      })
  }

  request.user = await User
    .findById(
      decodedToken.id
    )

  if (!request.user) {
    return response
      .status(404)
      .json({
        error: 'user is no longer available'
      })
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}