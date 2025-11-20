const initialAnecdotes = [
  {
    content: 'If it hurts, do it more often',
    id: 1,
    votes: 0
  },
  {
    content: 'Adding manpower to a late software project makes it later!',
    id: 2,
    votes: 0
  }
]

const anecdotesReducer = (state = initialAnecdotes, action) => {
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