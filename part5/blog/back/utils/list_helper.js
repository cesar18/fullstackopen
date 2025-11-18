const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs
      .reduce(
        (sum, blog) => sum + blog.likes,
        0
      )
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs
      .reduce(
        (best, blog) => blog.likes >= best.likes
          ? blog
          : best,
        {
          likes: -1
        })
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0){
    return {}
  }
  const authors = blogs
    .reduce((authors, blog) => {
      authors[blog.author] = (authors[blog.author] || 0) + 1
      return authors
    }, {})
  var mostCittedAuthor = { author: '', blogs: 0 }
  for (const author in authors) {
    if (authors[author] > mostCittedAuthor.blogs) {
      mostCittedAuthor = { author: author, blogs: authors[author] }
    }
  }
  return mostCittedAuthor
}

const mostLikes = (blogs) => {
  if(blogs.length === 0){
    return {}
  }
  const authors = blogs
    .reduce((authors, blog) => {
      authors[blog.author] = (authors[blog.author] || 0) + blog.likes
      return authors
    }, {})
  var mostLikedAuthor = { author: '', likes: 0 }
  for (const author in authors) {
    if (authors[author] > mostLikedAuthor.likes) {
      mostLikedAuthor = { author: author, likes: authors[author] }
    }
  }
  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}