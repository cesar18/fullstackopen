import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdotesReducer'

const AnecdotesForm = () => {
  const dispatch = useDispatch()
  
  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch(createAnecdote(content))
  }
  
  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdotesForm