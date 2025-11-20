const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const createAnecdote = async (content) => {
  const newAnecdote = {
    content: content,
    votes: 0
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // body can not be an JavaScript object,
    // must be converted to JASON string
    body: JSON.stringify(newAnecdote)
  }
  
  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  return await response.json()
}

const updateAnecdote = async (id, updatedAnecdote) => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedAnecdote)
  }

  const response = await fetch(`${baseUrl}/${id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }

  return await response.json()
}

export default { getAll, createAnecdote, updateAnecdote }