import { createSlice } from '@reduxjs/toolkit'
import anecdoteSevice from '../services/anecdotes'

// createSlice uses Immer library,
// which allows us to write "mutating" states, once imutable
const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      return state.map(anecdote =>
        anecdote.id !== id
          ? anecdote
          : { ...anecdote, votes: anecdote.votes + 1 }
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { voteAnecdote, setAnecdotes, createAnecdote } = anecdotesSlice.actions
// thunk action creator
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteSevice.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteSevice.createAnecdote(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const voteToAnecdote = (id, toBeUpdate) => {
  return async dispatch => {
    await anecdoteSevice.updateAnecdote(id, toBeUpdate)
    dispatch(voteAnecdote(id))
  }
}

export default anecdotesSlice.reducer