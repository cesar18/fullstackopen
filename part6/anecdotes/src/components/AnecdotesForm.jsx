import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdotesReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdotesForm = () => {
  const dispatch = useDispatch()
  
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(appendAnecdote(content))
    dispatch(createNotification(`you created '${content}'`, 5))
  }
  
  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdotesForm