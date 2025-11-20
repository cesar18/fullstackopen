import { useSelector, useDispatch } from "react-redux"
import { voteToAnecdote } from "../reducers/anecdotesReducer"
import Anecdote from "./Anecdote"
import { createNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({anecdotes, filter}) => {
      return anecdotes.filter(anecdote => 
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
    }
  )
  
  const handleVote = async (anecdote) => {
    dispatch(voteToAnecdote(
      anecdote.id,
      {
        votes: anecdote.votes + 1
      }
    ))
    dispatch(createNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <ul>
      {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => handleVote(anecdote)}
        />
      )}
    </ul>
  )
}

export default Anecdotes