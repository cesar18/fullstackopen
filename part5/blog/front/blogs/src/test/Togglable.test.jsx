import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from '../components/Togglable'
import { useRef } from 'react'

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div>togglable content</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    screen.getByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const element = screen.getByText('togglable content')
    expect(element).toBeVisible()
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })

  test('toggled content can be toggled using ref', async () => {
    const TestComponent = () => {
      const togglableRef = useRef()

      return (
        <div>
          <button onClick={() => togglableRef.current.toggleVisibility()}>
            toggle
          </button>
          <Togglable buttonLabel="show..." ref={togglableRef}>
            <div>togglable inside</div>
          </Togglable>
        </div>
      )
    }
    const user = userEvent.setup()
    render(<TestComponent />)

    const element = screen.getByText('togglable inside')
    expect(element).not.toBeVisible()

    const toggleButton = screen.getByText('toggle')
    await user.click(toggleButton)

    expect(element).toBeVisible()
  })
})