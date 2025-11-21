const Notification = ({ notification, setNotification }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  if (notification === '') {
    return null
  }

  setTimeout(() => {
    setNotification('')
  }, 5000)

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification