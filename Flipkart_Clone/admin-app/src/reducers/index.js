import authReducer from "./auth.reducers";
import { combineReducers } from "redux";
import userReducers from "./user.reducers";
import categoryReducer from "./category.reducers";
import productReducer from "./product.reducer";


const rootReducer = combineReducers({
    auth: authReducer,
    user : userReducers,
    category : categoryReducer,
    product : productReducer
})

export default rootReducer