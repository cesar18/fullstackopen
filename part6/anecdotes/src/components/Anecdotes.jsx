import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdotesReducer"
import Anecdote from "./Anecdote"

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({anecdotes, filter}) => 
    anecdotes.filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  )
  
  return (
    <ul>
      {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => dispatch(voteAnecdote(anecdote.id))}
        />
      )}
    </ul>
  )
}

export default Anecdotes