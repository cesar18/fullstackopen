import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Anecdotes from './components/Anecdotes'
import AnecdotesForm from './components/AnecdotesForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { initializeAnecdotes } from './reducers/anecdotesReducer'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
    //is considered good practice to add all 
    // functions and variables used to dependency array
  }, [dispatch])
  return (
    <div>
      <h2>Anedotes</h2>
      <Notification />
      <Filter />
      <Anecdotes />
      <AnecdotesForm />
    </div>
  )
}

export default App
