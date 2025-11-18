import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notifications'
import Togglable from './components/Togglable'
import loginService from './services/login'

const App = () => {
  const noErrorMessage = { error: false, message: null }
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(noErrorMessage)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notification = (error, message) => {
    setErrorMessage({
      error: error,
      message: message
    })
    setTimeout(() => {
      setErrorMessage(noErrorMessage)
    }, 3000)
  }

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    notification(false, 'logout successful' )
  }

  const createBlog = async (newBlog) => {
    try{
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      notification(false, `a new blog ${newBlog.title} by ${newBlog.author} added` )
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      notification(true, exception.response.data.error)
    }
  }

  const login = async (userForm) => {
    try{
      const userLogin = await loginService
        .login(userForm)
      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(userLogin)
      )
      blogService.setToken(userLogin.token)
      setUser(userLogin)
      notification(false, 'login successful' )
      return true
    } catch (exception) {
      notification(true, exception.response.data.error)
      return false
    }
  }

  const like = (blogId, likes) => async () => {
    await blogService.update(blogId, { likes: likes + 1 })
    setBlogs(blogs.map(blog => blog.id === blogId ? { ...blog, likes: likes + 1 } : blog))
  }

  const deleteBlog = (blogToRemove) => async () => {
    if(window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)){
      await blogService.remove(blogToRemove.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
    }
  }

  if (!user) {
    return <>
      <Notification error={errorMessage} />
      <LoginForm login={login} />
    </>
  }
  return (
    <div>
      <Notification error={errorMessage} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>
      <h2>blogs</h2>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          like={like(blog.id, blog.likes)}
          deleteBlog={deleteBlog(blog)}
          username={user.username}
        />
      )}
    </div>
  )
}

export default App
