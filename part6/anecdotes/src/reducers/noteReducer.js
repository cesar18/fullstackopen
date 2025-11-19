const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload]
    case 'TOGGLE_IMPORTANCE':
      return state.map(note =>
        note.id !== action.payload.id
          ? note
          : { ...note, important: !note.important }
      )
    default:
      return state
  }
}

export default noteReducer