import React from 'react';
import {Route, Redirect} from 'react-router-dom'

const PrivateRoute = ({component : Component, ...rest}) => {
    return <Route {...rest} component= {(props) => {
        const token = window.localStorage.getItem('token');

        if(token) {
            return <Component {...props} />            
        }else {
            return <Redirect to={'/signin'} />
        }
    }} />
}

// we can use key-value props like this 
// used to seperate props 

// const PrivateRoute = ({component : comp, path: p, exact: e}) => {
//     console.log(comp)
//     console.log(p)
//     console.log(e)
//     return <Route />
// }

export default PrivateRoute;