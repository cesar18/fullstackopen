import { useState } from 'react'

const Filter = ({name, handler}) => <div>filter shown with<input name="filter" value={name} onChange={handler}/></div>
const PersonForm = ({handleSubmit, name, handleName, number, handleNumber}) =>{
  return(
    <form onSubmit={handleSubmit}>
      <div>
        name: <input name="name" autoComplete="off" value={name} onChange={handleName}/>
      </div>
      <div>
        number: <input name="number" value={number} onChange={handleNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
const Persons = ({persons, filter}) => persons.filter(
  person=>person.name.toLowerCase().includes(filter)
).map(
  person=><p key={person.id}>{person.name} {person.number}</p>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  
  const handleNameChange = (event) =>{
    setNewName(event.target.value.toLowerCase())
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) =>{
    setFilterName(event.target.value)
  }
  
  const handleSubmitForm = (event) => {
    //console.log(event.target[0].value)
    event.preventDefault()
    if(persons.every(person=>person.name !== newName)){
      setPersons(persons.concat({
        id: persons.length + 1,
        name: newName,
        number: newNumber
      }))
    }else{
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter name={filterName} handler={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm 
        handleSubmit={handleSubmitForm}
        name={newName}
        handleName={handleNameChange}
        number={newNumber}
        handleNumber={handleNumberChange}
      /> 
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filterName}/>
    </div>
  )
}

export default App