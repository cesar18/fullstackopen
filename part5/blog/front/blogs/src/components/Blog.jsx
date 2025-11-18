import { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog, like, deleteBlog, username }) => {
  const [visible, setVisible] = useState(false)

  const handleViewHide = () => {
    setVisible(!visible)
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author} <button onClick={handleViewHide}> {visible ? 'hide' : 'view'} </button>
      {visible &&
        <div>
          <div><a href={blog.url}>{blog.url}</a></div>
          <div>likes {blog.likes} <button onClick={like}>like</button></div>
          <div>{blog.user.name}</div>
          {username === blog.user.username &&
            <div>
              <button onClick={deleteBlog}>remove</button>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default Blog