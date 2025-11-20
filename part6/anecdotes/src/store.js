import anectodesReducer from './reducers/anecdotesReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    anecdotes: anectodesReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

export default store