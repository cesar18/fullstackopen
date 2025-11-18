const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const config = require('../utils/config')
const User = require('../models/user')

const passHashGenerator = async (password) => {
  return await bcrypt
    .hash(
      `${password}${config.PEPPER}`,
      config.SALT_ROUNDS
    )
}

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (!password) {
    return response
      .status(400)
      .json({
        error: 'password is required'
      })
  }
  if (password.length < 3) {
    return response
      .status(400)
      .json({
        error: 'password length must be at least 3 characters'
      })
  }
  const passwordHash = await passHashGenerator(password)
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate(
      'blogs',
      {
        title: 1,
        author: 1,
        url: 1,
        likes: 1
      }
    ) // populate the blogs
  response.json(users)
})

module.exports = usersRouter