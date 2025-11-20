import ReactDOM from 'react-dom/client'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './App'
import anectodesReducer from './reducers/anecdotesReducer'
import filterReducer from './reducers/filterReducer'

const reducers = combineReducers({
  anecdotes: anectodesReducer,
  filter: filterReducer
})

const store = createStore(reducers)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)