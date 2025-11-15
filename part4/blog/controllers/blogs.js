const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate(
      'user',
      {
        username: 1,
        name: 1
      }
    )
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate(
      'user',
      {
        username: 1,
        name: 1
      }
    )
    // using await catch is no longer nedded they are passed as:
    //.catch(error => next(error))
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', {
      id: 1
    })

  if (!blog) {
    return response
      .status(404)
      .json({
        error: 'Blog not found'
      })
  }

  if (blog.user.id !== user._id.toString()) {
    return response
      .status(401)
      .json({
        error: 'only the creator can delete a blog'
      })
  }
  await blog.deleteOne()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const blogUpdate = request.body
  const blog = await Blog.findById(request.params.id)
  if (! blog) {
    return response.status(404).end()
  }

  blog.title = blogUpdate.title || blog.title
  blog.author = blogUpdate.author || blog.author
  blog.url = blogUpdate.url || blog.url
  blog.likes = blogUpdate.likes || blog.likes
  await blog.save()
  response.json(blog)
})

module.exports = blogRouter