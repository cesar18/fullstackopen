const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'cesar',
    url: 'http://example.com/first',
    likes: 5
  },
  {
    title: 'Second Blog',
    author: 'maria',
    url: 'http://example.com/second',
    likes: 10
  }
]

const usernameRoot = 'root'
const passwordRoot = 'sekret'

const inicializingUsers = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(`${passwordRoot}${config.PEPPER}`, config.SALT_ROUNDS)
  const rootUser = new User({
    username: usernameRoot,
    name: 'Superuser Root',
    passwordHash: passwordHash
  })
  await rootUser.save()
}

const inicializingBlogs = async () => {
  await inicializingUsers()
  const user = await User.findOne({
    username: usernameRoot
  })
  await Blog.deleteMany({})
  await Blog
    .insertMany(
      initialBlogs
        .map(blog => ({
          ... blog,
          user: user._id
        }))
    )
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'jose',
    url: 'http://example.com/temp',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const nonExistingUserId = async () => {
  const user = new User({
    username: 'willremovethissoon',
    name: 'goodbye',
    passwordHash: 'anyhash',
    likes: 0
  })
  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

const rootToken = async () => {
  const user = await User
    .findOne({
      username: usernameRoot
    })

  const userForToken = {
    username: usernameRoot,
    id: user._id,
  }

  const token = jwt
    .sign(
      userForToken,
      config.SECRET,
      { expiresIn: 2 * 60 }
    )

  return {
    user: user,
    token: token
  }
}

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  inicializingBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  nonExistingUserId,
  rootToken,
  inicializingUsers,
  usernameRoot,
  passwordRoot
}