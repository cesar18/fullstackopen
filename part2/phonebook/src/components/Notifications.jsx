const errorStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
}

const Notification = ({error, message }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={{...errorStyle, color: error ? 'red' : 'green'}}>
      {message}
    </div>
  )
}

export default Notification