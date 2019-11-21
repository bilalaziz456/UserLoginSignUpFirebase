import React, {Component} from 'react';
import {Button, Form, Container} from "react-bootstrap";

const SEND_INVENTORY = 'http://127.0.0.1:8080/addInventory';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventory: '',
            message : ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };
    handleSubmit = (e) => {
        fetch(SEND_INVENTORY, {
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Access-Control-Allow-Origin' : '*'
            },
            method : 'POST',
            body : JSON.stringify({
                inventory : this.state.inventory
            })
        }).then((res) => {
            res.json().then((value) => {
                this.setState({
                    message : value.message
                })
            })
        })
        e.preventDefault()
    };

    render() {
        return (
            <Container>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Inventory</Form.Label>
                    <Form.Control name='inventory' type="number" placeholder="Inventory" value={this.state.inventory}
                                  onChange={this.handleChange}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                    Submit
                </Button>
                <p className='color-red'>{this.state.message}</p>
            </Container>
        );
    }
}

export default Admin;