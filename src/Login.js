import React, {Component} from 'react';
import CreateAccount from "./CreateAccount";
import User from "./User";
import Admin from "./Admin";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';
import './App.css';
const LOGIN = 'login';
const CREATE_ACCOUNT = 'create account';
const LOGIN_SUCCESSFUL = 'Login successful';
const USER = 'user';
const ADMIN_PANEL = 'Admin Panel';
const SEND_LOGIN_INFORMATION = 'http://127.0.0.1:8080/login';
class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '',
            action : LOGIN,
            productKey : '',
            message : ''
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    };
    handleSubmit = (e) => {
        fetch(SEND_LOGIN_INFORMATION, {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            body: JSON.stringify({
                email: this.state.email,
                password : this.state.password,
            })
        }).then((res) => {
            res.json().then((msg) => {
                if(msg.message === LOGIN_SUCCESSFUL) {
                    switch (msg.role) {
                        case 0:
                            this.setState({
                                action : ADMIN_PANEL
                            });
                            break;
                        case 1:
                            this.setState({
                                action : USER,
                                productKey : msg.productKey
                            });
                            break;
                        default:
                            this.setState({
                                message : 'No user found'
                            });
                            break
                    }
                } else {
                    this.setState({
                        message : msg.message
                    })
                }
            })
        });
        e.preventDefault()
    };
    createAccount = () => {
        this.setState({
            action : CREATE_ACCOUNT
        })
    };
    render() {
        if(this.state.action === LOGIN) {
            return (
                <div className="Login-center">
                    <div className='Login-border'>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control name='email' type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name='password' type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                                Login
                            </Button>
                            <a className='Login-create-account' onClick={this.createAccount} href='#'>Create Account</a>
                            <p className='color-red'>{this.state.message}</p>
                        </Form>

                    </div>
                </div>
            );
        }
        else if(this.state.action === CREATE_ACCOUNT) {
            return <CreateAccount/>
        }
        else if(this.state.action === USER){
            return <User productKey = {this.state.productKey}/>
        }
        else if (this.state.action === ADMIN_PANEL){
            return <Admin/>
        }
    }
}

export default Login;