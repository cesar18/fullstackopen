const errorStyle = {
  background: 'lightgrey',
  fontSize: 20,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
}

const Notification = ({ error }) => {
  if (error.message === null) {
    return null
  }

  return (
    <div className="notification" style={{ ...errorStyle, color: error.error ? 'red' : 'green' }}>
      {error.message}
    </div>
  )
}

export default Notification