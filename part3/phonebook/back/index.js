require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
// if no root, execute frontend
// dist is folder where vite build all files
// transpiling, minimaxing and merging files
app.use(express.static('dist'))

// defines the structure of body passed in require
app.use(express.json())

// specify output of morgan
morgan.token('type', (req, res) => { 
    return JSON.stringify(req.body)
})
// uses are sequencial as they appear on index
// first we must standerysed the body before showing
// requestLogger*
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/info', (request, response) => {
    const time = new Date
    Person
    .find({})
    .then(persons=>{
      response
      .send(`<p>
        Phonebook has info for ${persons.length} people<br/>
        ${time.toString()}
        </p>`
      )
    })
})

app.get('/api/persons', (request, response) => {
    Person
    .find({})
    .then(persons=>{
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person=>{
      if(person){
        response.json(person)
      }else{
        response.statusMessage = "Person does not exists"
        response.status(404).end()
      }
    })
    .catch(error=>next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result=>{
        response.status(204).end()
      })
      .catch(error=>next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    //return is crucial to stop code further
    return response.status(400).json({ 
      error: 'The name or number is missing' 
    })
  }

  Person.findOne({name: body.name})
    .then(person=>{
      if(!person){
        person = new Person({
          name: body.name,
          number: body.number
        })
      }else{
        person.number = body.number
      }

      person
        .save()
        .then(personSaved=>{
          response.json(personSaved)
        })
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person
    .findById(request.params.id)
    .then(person=>{
      if(!person){
        return response.status(400).end()
      }

      person.name = name
      person.number = number

      return person
        .save()
        .then((updatedPerson)=> {
          response.json(updatedPerson)
        })
    })
    .catch(error=>next(error))
})

// defines a route of page not found
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// if none route is ispecified, goes to page 404 (Not Found)
app.use(unknownEndpoint)


// route to define when error ocours
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

// starts listenning (at the end of file)
// process.env.PORT is default port of Render
// if not in Render (not defined), use port 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})