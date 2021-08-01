import axios from "../helpers/axios"
import { authConstants } from "./constants"


// We can define action creators that returns a function (instead of an action) because we are using the thunk middleware
export const login = (user) => {
    return async (dispatch) => {

        console.log(user)
        
        dispatch({type : authConstants.LOGIN_REQUEST})
        const res = await axios.post('/admin/signin', {
          ...user  
        })

        if(res.status === 200){
            const {token, user} = res.data
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            dispatch({
                type: authConstants.LOGIN_SUCCESS,
                payload: {
                    token, user
                }
            })

        } else {
            if (res.status === 400) {
                dispatch({
                    type : authConstants.LOGIN_FAILURE,
                    payload: {error : res.data.error}
                })
            }
        }
    }
}

export const isUserLoggedIn = () => {
    return async dispatch => {
        const token = localStorage.getItem('token')
        if(token){
            const user = JSON.parse(localStorage.getItem('user'))
            dispatch({
                type : authConstants.LOGIN_SUCCESS,
                payload: {
                    token, user
                } 
            })
        } else {
            dispatch({
                type : authConstants.LOGIN_FAILURE,
                payload: {error : "failed to login"}
            })
        }
    }
}

export const signout = () => {
    return async dispatch => {

        dispatch({
            type: authConstants.LOGOUT_REQUEST
        })
        const res = await axios.post("/admin/signout")
        console.log(res)

        if(res.status === 200) {
            localStorage.clear();
            dispatch({
                type: authConstants.LOGOUT_SUCCESS
            })
        } else {
            dispatch({
                type: authConstants.LOGOUT_FAILURE,
                payload : {error : res.data.error}
            })
        }
    }
}


// an action creator is a function that returns an action
// an action is a javascript object that has a type property

// export const login = (user) => {
//     return {
        
//             type : authConstants.LOGIN_REQUEST,
//             payload : {
//                 ...user
//             }
//         }
//     }


