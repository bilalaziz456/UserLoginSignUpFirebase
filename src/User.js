import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
const  PURCHASE = 'http://127.0.0.1:8080/purchase';
const IN_STOCK = 'In stock';
const OUT_OF_STOCK = 'Out of stock'
class User extends Component {
    constructor(props){
        super(props);
        this.state = {
            action : IN_STOCK
        }
    }
    handlePurchase = (e) => {
        fetch(PURCHASE).then((res) => {
            res.json().then((value) => {
                if(value.message === OUT_OF_STOCK) {
                    this.setState({
                        action : OUT_OF_STOCK
                    })
                }
            });
        });
        e.preventDefault()
    };
    render() {
        if(this.state.action === IN_STOCK) {
            return (
                <div>
                    <h1>Login Successful</h1>
                    <h3>Your Api Key is <span className='color-red'>{this.props.productKey}</span></h3>
                    <Button variant="primary" type="submit" onClick={this.handlePurchase}>
                        Purchase
                    </Button>
                </div>
            );
        } else if(this.state.action === OUT_OF_STOCK){
            return (
                <div>
                    <h1>Login Successful</h1>
                    <h3>Your Api Key is <span className='color-red'>{this.props.productKey}</span></h3>
                    <Button variant="secondary" type="submit" disabled>
                        Out of Stock
                    </Button>
                </div>
            )
        }

    }
}

export default User;