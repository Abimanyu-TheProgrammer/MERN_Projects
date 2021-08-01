import authReducer from "./auth.reducers";
import { combineReducers } from "redux";
import userReducers from "./user.reducers";
import categoryReducer from "./category.reducers";


const rootReducer = combineReducers({
    auth: authReducer,
    user : userReducers,
    category : categoryReducer
})

export default rootReducer