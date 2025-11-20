import Anecdotes from './components/Anecdotes'
import AnecdotesForm from './components/AnecdotesForm'
import Filter from './components/Filter'

function App() {
  return (
    <div>
      <h2>Anedotes</h2>
      <Filter />
      <Anecdotes />
      <AnecdotesForm />
    </div>
  )
}

export default App
