import React, {useState} from 'react'
import Layout from '../../components/Layouts'
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import Input from '../../components/UI/Input';
import { useDispatch, useSelector} from "react-redux";
import {Redirect} from 'react-router-dom'
import { signup } from "../../actions";
/**
* @author
* @function Signup
**/

const Signup = (props) => {

  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  // const [ error, setError ] = useState('')
  const auth = useSelector(state => state.auth) // a hook to get the state in the redux store
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()


  const userSignup = (e) => {

    e.preventDefault()

    const user = {
      firstName, lastName, password, email
    }

    dispatch(signup(user))
  }

  if(auth.authenticate) {
    return <Redirect to={"/"}/>
  }

  if (user.loading) {
    return <p>Loading ...</p>
  }


  return(
    <Layout>
      <Container>
        <Row style={{marginTop: "50px"}}>
          <Col md={{span : 6, offset: 3}}>
            <Form onSubmit={userSignup}>
              <Row>
                <Col md={6}>
                  <Input 
                  label="First Name" 
                  placeholder = "First Name" 
                  type="text"
                  onChange = {(e) => setFirstName(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                <Input                  
                label="Last Name" 
                placeholder = "Last Name" 
                type="text"
                onChange = {(e) => setLastName(e.target.value)}
                />
                </Col>
              </Row>
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

export default Signup