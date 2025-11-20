const anecdotesReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_ANECDOTE':
      return [...state, action.payload]
    case 'VOTE':
      return state.map(anecdote =>
        anecdote.id !== action.payload.id
          ? anecdote
          : { ...anecdote, votes: anecdote.votes + 1 }
      )
    default:
      return state
  }
}

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

export const createAnecdote = content => {
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content,
      id: generateId(),
      votes: 0
    }
  }
}

export const voteAnecdote = id => {
  return {
    type: 'VOTE',
    payload: {
      id
    }
  }
}

export default anecdotesReducer