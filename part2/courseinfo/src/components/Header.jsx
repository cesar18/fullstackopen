const Header = ({size, text}) => {
  return (
    size == 1 ? 
      <h1>{text}</h1> :
      size == 2 ? 
        <h2>{text}</h2> :
        <h4>{text}</h4>
  )
}

export default Header