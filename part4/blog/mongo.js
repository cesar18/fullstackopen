const mongoose = require('mongoose')
const config = require('./utils/config')
const Blog = require('./models/blog')

mongoose.set('strictQuery',false)

// { family: 4 } is to use IP4
mongoose.connect(config.MONGODB_URI, { family: 4 })

if(process.argv[2]){
  const blog = new Blog({
    title: process.argv[2],
    author: process.argv[3],
    url: process.argv[4],
    likes: process.argv[5] || 0
  })
  blog.save().then(result => {
    console.log(`added ${result.title} : ${result.author} to blogs`)
    mongoose.connection.close()
  })
}else{
  Blog
    .find({})
    .then(blogs => {
      console.log('blogs:')
      blogs.forEach(blog => {
        console.log(`${blog.title} : ${blog.author} (${blog.likes} likes)`)
      })
      //must close conection inside then or catch
      mongoose.connection.close()
    })
}