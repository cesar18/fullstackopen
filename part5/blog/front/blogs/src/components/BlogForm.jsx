import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault()
    await createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title: <input
              type="text"
              name="title"
              value={title}
              placeholder='write the title of the blog'
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Author: <input
              type="text"
              name="author"
              value={author}
              placeholder='write the author'
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url: <input
              type="url"
              name="url"
              value={url}
              placeholder='write the url'
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">
            Create Blog
          </button>
        </div>
      </form>
    </>
  )
}

export default BlogForm