const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://cesar_db_user:${password}@cluster0.hdg0833.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

// { family: 4 } is to use IP4
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: {
    type: String,
    minLength: 5,
    required: true
  },
})

const Person = mongoose.model('Person', personSchema)
if(process.argv[4]){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
}else{
    Person
    .find({})
    .then(persons => {
        console.log('phonebook:')
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        //must close conection inside then or catch
        mongoose.connection.close()
    })
}