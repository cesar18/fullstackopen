const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // custom validation messages
    required: [true, 'username is required'],
    minLength: [3, 'username length must be at least 3 characters'],
    // if already is a document thats viollates uniqueness
    // this index will not Work!
    unique: true // this ensures the uniqueness of username
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // ref will link the Blog model
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User