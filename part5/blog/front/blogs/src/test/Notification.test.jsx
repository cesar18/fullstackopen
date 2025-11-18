import { expect } from 'vitest'
import Notification from '../components/Notifications'
import { render, screen } from '@testing-library/react'

describe('<Notification />', () => {
  test('renders message when message red prop is given', () => {
    const error = { message: 'Test notification', error: true }
    render(<Notification error={error} />)
    const element = screen.getByText('Test notification')
    expect(element).toBeDefined()
    expect(element).toHaveStyle('color: rgb(255, 0, 0);')
  })

  test('renders message when message green prop is given', () => {
    const error = { message: 'Test notification', error: false }
    render(<Notification error={error} />)
    const element = screen.getByText('Test notification')
    expect(element).toBeDefined()
    expect(element).toHaveStyle('color: rgb(0, 128, 0);')
  })

  test('does not render when message prop is null', () => {
    const error = { message: null, error: true }
    const { container } = render(<Notification error={error} />)
    expect(container).toBeEmptyDOMElement()
  })
})