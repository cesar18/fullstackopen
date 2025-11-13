const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

// { family: 4 } is to use IP4
mongoose.connect(url, { family: 4 })
    .then(result=>{
        console.log('connected to MongoDB')
    })
    .catch(error=>{
        console.log('error connecting to MongoDB: ',error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)