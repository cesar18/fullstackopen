import axios from 'axios'
const baseUrl = '/api/login'

const login = async credenctials => {
  const response = await axios.post(baseUrl, credenctials)
  return response.data
}

const logout = () => {
  window.localStorage.removeItem('loggedBlogAppUser')
}

export default { login, logout }