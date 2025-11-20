import Anecdotes from './components/Anecdotes'
import AnecdotesForm from './components/AnecdotesForm'
import Filter from './components/Filter'
import Notification from './components/Notification'

function App() {
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
