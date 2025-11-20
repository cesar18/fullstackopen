import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdotesReducer"
import Anecdote from "./Anecdote"
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({anecdotes, filter}) => 
    anecdotes.filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  )
  
  const handleVote = (id, content) => {
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`you voted '${content}'`))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)  
  }

  return (
    <ul>
      {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => handleVote(anecdote.id, anecdote.content)}
        />
      )}
    </ul>
  )
}

export default Anecdotes