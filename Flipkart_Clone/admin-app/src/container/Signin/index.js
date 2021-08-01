import React, {useState} from 'react'
import Layout from '../../components/Layouts'
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import Input from '../../components/UI/Input';
import { login } from "../../actions";
import { useDispatch, useSelector} from "react-redux";
import { Redirect } from 'react-router-dom'; 

/**
* @author
* @function Signin
**/
const Signin = (props) => {

  const [ email, setEmail ] = useState('')
  const [password, setPassword] = useState('')
  // const [error, setError] = useState('')
  const dispatch = useDispatch() // replaces the higher order component connect()
  const state = useSelector(state => state.auth) // a hook to get the state in the redux store

  const userLogin = (e) => {

    e.preventDefault(); 
    
    const user = {
      email, password
    }

    dispatch(login(user));
  }

  if(state.authenticate) {
    return <Redirect to={"/"}/>
  }

  if(state.authenticating) {
    return (<p>Loading...!</p>)
  }

  return (
    <Layout>
      <Container>
        <Row style={{marginTop: "50px"}}>
          <Col md={{span : 6, offset: 3}}>
            <Form onSubmit={userLogin}>
              <Input                  
                label="Email" 
                placeholder = "Email" 
                type="email"
                onChange = {(e) => setEmail(e.target.value)}
                />

                <Input                  
                label="Password" 
                placeholder = "Password" 
                type="password"
                onChange = {(e) => setPassword(e.target.value)}
                />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  )

}
export default Signin