import { useState, useEffect } from 'react'
import personService from './services/persons'

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
const Persons = ({persons, filter, handleDelete={handleDelete}}) => persons.filter(
  person=>person.name.toLowerCase().includes(filter)
).map(
  person=><p key={person.id}>{person.name} {person.number} <button onClick={handleDelete(person.id, person.name)}>delete</button></p>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  useEffect(()=>{
    personService.getAll().then(response => setPersons(response))
  },[])

  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) =>{
    setFilterName(event.target.value.toLowerCase())
  }

  const handleDelete = (id, name) => () => {
    if(confirm(`Delete ${name} ?`)){
      personService.remove(id).then(response=>{
        setPersons(persons.filter(person=>person.id !== id))
      })
    }
  }

  const handleSubmitForm = (event) => {
    //console.log(event.target[0].value)
    event.preventDefault()
    const newPerson = persons.find(person=>person.name === newName)
    if(newPerson === undefined){
      personService.create({
        name: newName,
        number: newNumber
      }).then(response=>{
        setPersons(persons.concat(response))
      })
    }else{
      if(confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService.update(newPerson.id, {
          ...newPerson,
          number: newNumber
        }).then(response=>{
          setPersons(persons.map(person => person.id === response.id ? response : person))
        }).catch(error => {
          alert(`'${newName}' was already deleted from server`)
          setPersons(persons.filter(person=>person.name !== newName))
        })
      }
    }
    setNewName('')
    setNewNumber('')
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
      <Persons persons={persons} filter={filterName} handleDelete={handleDelete}/>
    </div>
  )
}

export default App