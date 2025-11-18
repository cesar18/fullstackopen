import { render, screen } from '@testing-library/react'
import LoginForm from '../components/LoginForm'
import userEvent from '@testing-library/user-event'

test('<LoginForm /> updates parent state and calls onSubmit', async () => {
  const login = vi.fn().mockResolvedValue(true)
  const user = userEvent.setup()

  render(<LoginForm login={ login } />)

  const username = screen.getByLabelText('username')
  const password = screen.getByLabelText('password')

  await user.type(username, 'Cesar Cícero')
  await user.type(password, '012345')
  expect(username).toHaveValue('Cesar Cícero')
  expect(password).toHaveValue('012345')
  const sendButton = screen.getByText('login')
  await user.click(sendButton)

  expect(login.mock.calls).toHaveLength(1)
  expect(login.mock.calls[0][0].username).toBe('Cesar Cícero')
  expect(login.mock.calls[0][0].password).toBe('012345')
  expect(username).toHaveValue('')
  expect(password).toHaveValue('')
})

test('<LoginForm /> updates parent state and calls onSubmit', async () => {
  const login = vi.fn().mockResolvedValue(false)
  const user = userEvent.setup()

  render(<LoginForm login={ login } />)

  const username = screen.getByLabelText('username')
  const password = screen.getByLabelText('password')

  await user.type(username, 'Cesar Cícero')
  await user.type(password, '012345')
  const sendButton = screen.getByText('login')
  await user.click(sendButton)

  expect(username).toHaveValue('Cesar Cícero')
  expect(password).toHaveValue('012345')
})