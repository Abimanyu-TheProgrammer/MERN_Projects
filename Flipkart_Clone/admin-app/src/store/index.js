import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from '../reducers'

// More on the thunk middleware in the auth.actions.js in the actions folder
const store = createStore(rootReducer, applyMiddleware(thunk))

export default store;