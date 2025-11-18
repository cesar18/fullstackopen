import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import { describe, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Jane Doe',
  url: 'https://reactjs.org/',
  likes: 5,
  user: {
    name: 'John Smith',
    username: 'johnsmith'
  },
}
let username = 'johnsmith'
let mockHandlerDelete
let mockHandlerLike

describe('Blog component', () => {
  beforeEach(() => {
    mockHandlerDelete = vi.fn()
    mockHandlerLike = vi.fn()
    render(<Blog blog={blog} like={mockHandlerLike} deleteBlog={mockHandlerDelete} username={username}/>)
  })

  test('renders content', () => {
    // exact: false means partial match, or
    // we can use findByText instead of getByText
    // findByText returns a promise so we need to use async/await
    const blogTitle = screen.getByText(`${blog.title} ${blog.author}`, { exact: false })
    expect(blogTitle).toBeDefined()
  })

  test('test visibility', async () => {
    // exact: false means partial match, or
    // we can use findByText instead of getByText
    // findByText returns a promise so we need to use async/await
    const user = userEvent.setup()
    const buttonView = screen.getByText('view')
    await user.click(buttonView)
    const url = screen.getByText(blog.url)
    const likes = screen.getByText(`likes ${blog.likes}`, { exact: false })
    const usernameText = screen.getByText(blog.user.name)
    const deleteButton = screen.getByText('remove')
    const likeButton = screen.getByText('like')
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(usernameText).toBeDefined()
    expect(deleteButton).toBeDefined()
    expect(likeButton).toBeDefined()
  })

  test('Test buttons click', async () => {
    const user = userEvent.setup()
    const buttonView = screen.getByText('view')
    await user.click(buttonView)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandlerLike).toHaveBeenCalledTimes(2)
    const deleteButton = screen.getByText('remove')
    await user.click(deleteButton)
    expect(mockHandlerDelete).toHaveBeenCalledTimes(1)
  })

  /** this is to tast the button click
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(mockHandler).toHaveBeenCalledTimes(1)
    */

})