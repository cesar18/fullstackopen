const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await helper.inicializingUsers()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken or invalid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUsers = [
      {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      },
      {
        username: 'ro',
        name: 'Superuser',
        password: 'salainen',
      },
      {
        name: 'Superuser',
        password: 'salainen',
      }
    ]

    let result = await api
      .post('/api/users')
      .send(newUsers[0])
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    result = await api
      .post('/api/users')
      .send(newUsers[1])
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username length must be at least 3 characters'))

    result = await api
      .post('/api/users')
      .send(newUsers[2])
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username is required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is not present', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUsers = [
      {
        username: 'mluukkai',
        name: 'mluukkai',
        password: 'sa',
      },
      {
        username: 'mluukkai',
        name: 'mluukkai',
      }
    ]

    let result = await api
      .post('/api/users')
      .send(newUsers[0])
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('password length must be at least 3 characters'))

    result = await api
      .post('/api/users')
      .send(newUsers[1])
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('password is required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Test login of root', async () => {
    const usersAtStart = await helper.usersInDb()
    const userRoot = usersAtStart[0]
    const userLogin = {
      username: userRoot.username,
      password: 'sekret'
    }

    const result = await api
      .post('/api/login')
      .send(userLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(userRoot.username, result.body.username)
    assert.strictEqual(userRoot.name, result.body.name)
    assert.ok(result.body.token)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Test login of new user', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtStart = await helper.usersInDb()

    const userLogin = {
      username: newUser.username,
      password: newUser.password
    }

    const result = await api
      .post('/api/login')
      .send(userLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(newUser.username, result.body.username)
    assert.strictEqual(newUser.name, result.body.name)
    assert.ok(result.body.token)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('when there is initially blogs notes saved', () => {
  beforeEach(async () => {
    await helper.inicializingBlogs()
    // inicializing this way causes an errror
    // because forEach is synchrounous
    // its arguments will wait, but the functions no
    //helper.initialBlogs.forEach(async (blog) => {
    //  let blogObject = new Blog(blog)
    //  await blogObject.save()
    //})

    // Thos method does work, but mongoose has a method to insert many
    //for (let blog of helper.initialBlogs) {
    //  let blogObject = new Blog(blog)
    //  await blogObject.save()
    //)

    // More elegant method using mongoose
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const author = response.body.map(e => e.author)
    assert.strictEqual(author.includes('cesar'), true)
  })

  describe('viewing a specific blog', () => {
    test('a specific blog can be viewed', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]
      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new blogs', () => {
    test('test Autentification', async () => {
      const newBlog = {
        title: 'Third Blog',
        author: 'john',
        url: 'http://example.com/third',
        likes: 15
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('token invalid'))
    })

    test('a valid blog can be added, with id property', async () => {
      const tokenData = await helper.rootToken()
      const newBlog = {
        title: 'Third Blog',
        author: 'john',
        url: 'http://example.com/third',
        likes: 15
      }

      const blogReturned = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${tokenData.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.ok(blogReturned.body.id)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert.strictEqual(titles.includes('Third Blog'), true)

      const author = blogsAtEnd.map(r => r.author)
      assert.strictEqual(author.includes('john'), true)

      const url = blogsAtEnd.map(r => r.url)
      assert.strictEqual(url.includes('http://example.com/third'), true)

      const likes = blogsAtEnd.map(r => r.likes)
      assert.strictEqual(likes.includes(15), true)
    })

    test('likes are defined as 0 if missed', async () => {
      const tokenData = await helper.rootToken()
      const newBlog = {
        title: 'Third Blog',
        author: 'john',
        url: 'http://example.com/third'
      }

      const blogReturned = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${tokenData.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(blogReturned.body.likes, 0)
    })

    test('test if properties are misses calls 400', async () => {
      const tokenData = await helper.rootToken()
      const newBlog = {
        title: 'Third Blog',
        author: 'john'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${tokenData.token}`)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
      const tokenData = await helper.rootToken()
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${tokenData.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const contents = blogsAtEnd.map(n => n.title)
      assert(!contents.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('updating of a blog', () => {
    test('a blog can be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const blogUpdate = {
        title: 'Updated Title'
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogUpdate)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(n => n.title)
      assert(!titles.includes(blogToUpdate.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('update likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const blogUpdate = {
        likes: Math.floor(Math.random() * 100) + 1 + blogToUpdate.likes
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogUpdate)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      const likes = blogsAtEnd.map(n => n.likes)
      assert(!likes.includes(blogToUpdate.likes))
      assert(likes.includes(blogUpdate.likes))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})