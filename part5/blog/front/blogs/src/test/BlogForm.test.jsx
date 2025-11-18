import { render, screen } from '@testing-library/react'
import BlogForm from '../components/BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)
  /** alternative way
  const inputs = screen.getAllByRole('textbox')
  or: const title = screen.getByPlaceholderText('write the title of the blog')
  expect(inputs).toHaveLength(3)

  await user.type(inputs[0], 'Testing Title')
  await user.type(inputs[1], 'Testing Author')
  await user.type(inputs[2], 'http://testingurl.com')
  */
  const title = screen.getByLabelText('Title:')
  const author = screen.getByLabelText('Author:')
  const url = screen.getByLabelText('url:')

  await user.type(title, 'Testing Title')
  await user.type(author, 'Testing Author')
  await user.type(url, 'http://testingurl.com')
  const sendButton = screen.getByText('Create Blog')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testingurl.com')
})