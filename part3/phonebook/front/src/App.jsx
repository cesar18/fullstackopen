import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notifications'

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
  const noErrorMessage = {error: false, message: null}
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [errorMessage, setErrorMessage] = useState(noErrorMessage)
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
      }).catch(error=>{
        setPersons(persons.filter(person=>person.id !== id))
        setErrorMessage({
          message: `'${name}' was already deleted from server`,
          error: true
        })
        setTimeout(() => {
          setErrorMessage(noErrorMessage)
        }, 5000)
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
        setErrorMessage({
          message: `Added ${newName}`,
          error: false
        })
        setTimeout(() => {
          setErrorMessage(noErrorMessage)
        }, 5000)
      })
    }else{
      if(confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService.update(newPerson.id, {
          ...newPerson,
          number: newNumber
        }).then(response=>{
          setPersons(persons.map(person => person.id === response.id ? response : person))
          setErrorMessage({
            message: `Updated ${newName}`,
            error: false
          })
          setTimeout(() => {
            setErrorMessage(noErrorMessage)
          }, 3000)
        }).catch(error => {
          setPersons(persons.filter(person=>person.name !== newName))
          setErrorMessage({
            message: `'${newName}' was already deleted from server`,
            error: true
          })
          setTimeout(() => {
            setErrorMessage(noErrorMessage)
          }, 3000)
        })
      }
    }
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Hi</h2>
      <h2>Phonebook</h2>
      <Notification error={errorMessage.error} message={errorMessage.message}/>
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