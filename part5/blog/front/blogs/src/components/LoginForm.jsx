import { useState } from 'react'

const Loginform = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const onChangeUsername = (event) => {
    setUsername(event.target.value)
  }
  const onChangePassword = (event) => {
    setPassword(event.target.value)
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    if( await login({
      username: username,
      password: password
    })){
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              name="Username"
              onChange={onChangeUsername}
              value={username}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              name="Password"
              onChange={onChangePassword}
              value={password}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Loginform