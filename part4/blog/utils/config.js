require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
const PEPPER = process.env.PEPPER
const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  SALT_ROUNDS,
  PEPPER,
  SECRET
}