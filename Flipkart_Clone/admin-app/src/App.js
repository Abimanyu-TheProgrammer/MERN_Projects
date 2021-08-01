import './App.css';
import React, {useEffect} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './container/Home'
import Signin from './container/Signin'
import Signup from './container/Signup'
import PrivateRoute from './HOC/PrivateRoute';
import { useDispatch, useSelector } from "react-redux";
import {isUserLoggedIn} from './actions/auth.actions'
import Products from './container/Products';
import Orders from './container/Orders';
import Category from './container/Category';



function App() {

  const dispatch = useDispatch() // replaces the higher order component connect()
  const auth = useSelector(state => state.auth) // a hook to get the state in the redux store


  // useEffect is like componentDidMount
  useEffect(() => {
    if(!auth.authenticate){
      dispatch(isUserLoggedIn())
    }
  }, [])

  return (
    <div className="App">
      <Switch>
        <PrivateRoute path='/' exact component={Home}/>
        <PrivateRoute path='/products' component={Products} />
        <PrivateRoute path='/orders' component={Orders}/>
        <PrivateRoute path='/category' component={Category}/>
        <Route path='/signin' component={Signin}></Route>
        <Route path='/signup' component={Signup}></Route>
      </Switch>
    </div>
  );
}

export default App;
