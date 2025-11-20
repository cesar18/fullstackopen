import { createSlice } from '@reduxjs/toolkit'

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

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

// createSlice uses Immer library,
// which allows us to write "mutating" states, once imutable
const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: initialAnecdotes,
  reducers: {
    createAnecdote(state, action) {
      return state.concat({
        content: action.payload,
        id: generateId(),
        votes: 0
      })
    },
    voteAnecdote(state, action) {
      const id = action.payload
      return state.map(anecdote =>
        anecdote.id !== id
          ? anecdote
          : { ...anecdote, votes: anecdote.votes + 1 }
      )
    }
  }
})

export const { createAnecdote, voteAnecdote } = anecdotesSlice.actions
export default anecdotesSlice.reducer