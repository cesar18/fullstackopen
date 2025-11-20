const Anecdote = ({anecdote, handleVote}) => {
  return (
    <li>
      {anecdote.content}<br/>
      has {anecdote.votes}
      <button onClick={handleVote}>
        vote
      </button>
    </li>
  )
}

export default Anecdote