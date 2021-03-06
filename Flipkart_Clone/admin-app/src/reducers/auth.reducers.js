import { authConstants } from "../actions/constants";

const initState = {
    token : null,
    user : {
        firstName : '',
        lastName : '',
        email: '',
        picture: ''
    },
    authenticate : false,
    authenticating : false,
    loading : false,
    message : '',
    error : null
};

// "action" parameter in the reducers are what we pass as an argument in the dispatch function
const authReducer = (state = initState , action) => {

    console.log(action)
    
    switch(action.type){
        case authConstants.LOGIN_REQUEST:
            state = {
                ...state,
                authenticating : true
            }
            break;
        
        case authConstants.LOGIN_SUCCESS: 
            state = {
                ...state,
                user : action.payload.user,
                token : action.payload.token,
                authenticate : true,
                authenticating: false
            }
            break;

        case authConstants.LOGIN_FAILURE: 
        state = {
            ...state,
            user : action.payload.user,
            token : action.payload.token,
            authenticate : false,
            authenticating: false
        }
        break;

        case authConstants.LOGOUT_REQUEST:
            state = {
                ...state,
                loading : true
            }
            break;

        case authConstants.LOGOUT_SUCCESS:
            state = {
                ...initState
            }
            break;
        
        case authConstants.LOGOUT_FAILURE:
        state = {
            ...state,
            loading : false,
            error : action.payload.error
        }
        break;

        default :
            break;
    }

    return state;
}

export default authReducer