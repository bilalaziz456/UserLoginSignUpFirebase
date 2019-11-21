import React, {Component} from 'react';
import Login from "./Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form, Container, Row, Col} from 'react-bootstrap';
import './App.css';
const CREATE_ACCOUNT = 'createAccount';
const LOGIN = 'login';
const VERIFY_EMAIL = 'Verify email';
const SEND_USER_INFORMATION = 'http://127.0.0.1:8080/createAccount';
class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            confirmPassword: '',
            action : CREATE_ACCOUNT,
            message : ''
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    };
    handleSubmit = (e) => {
        fetch(SEND_USER_INFORMATION, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method : 'POST',
            body : JSON.stringify({
                firstName   : this.state.firstName,
                lastName    : this.state.lastName,
                email       : this.state.email,
                password    : this.state.password
            })
        }).then((res) => {
            res.json().then((msg) => {
                if(msg.message === VERIFY_EMAIL){
                    this.setState({
                        action : VERIFY_EMAIL,
                        email : msg.email
                    })
                }
               // this.setState({
               //     message : msg.message
               // })
            })
        });
        e.preventDefault()
    };
    login = () => {
        this.setState({
            action : LOGIN
        });
    };
    render() {
        if(this.state.action === CREATE_ACCOUNT) {
            return (
                <Container>
                    <h2> Create Account </h2>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId='formFirstName'>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control name='firstName' type='text' placeholder='Enter first name'
                                                  value={this.state.firstName} onChange={this.handleChange}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId='formLastName'>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control name='lastName' type='text' placeholder='Enter last name'
                                                  value={this.state.lastName} onChange={this.handleChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control name='email' type="email" placeholder="Enter email" value={this.state.email}
                                          onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name='password' type="password" placeholder="Password"
                                          value={this.state.password} onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control name='confirmPassword' type="password" placeholder="Password"
                                          value={this.state.confirmPassword} onChange={this.handleChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                            Submit
                        </Button>
                        <a className='Login-create-account' onClick={this.login} href='#'>Login</a>
                        <p className='color-red'>{this.state.message}</p>
                    </Form>
                </Container>

            );
        } else if (this.state.action === LOGIN ) {
            return <Login/>
        } else if(this.state.action === VERIFY_EMAIL){
            return (
               <Container>
                   <h2>Confirm Your Email Address</h2>
                   <p>A confirmation email has been sent to <span className='color-red'>{this.state.email}</span>. Click on the confirmation link in the email to activate your account</p>
               </Container>

            )
        }

    }
}

export default CreateAccount;