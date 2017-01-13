import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import PaySuccess from './paymentsuccess.comp';

export default class Stripe extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            cart:{
                items: props.cartData.items,
                totalPrice: props.cartData.totalPrice
            },
            show:false,
        };
        this.onToken=this.onToken.bind(this);
    }

    onToken(token) {
        this.props.lock();
        let upData = new FormData();
        upData.append("amount",this.state.cart.totalPrice*100);
        upData.append("email",token.email);
        upData.append("token",token.id);
        axios.post('http://localhost:5000/charge',upData)
            .then(response => {
                if (response.status===200){
                    localStorage.order = JSON.stringify(response.data.Ordernumber);
                    this.setState({show:true});
                }
                console.log(response);
            })
            .catch((err) => {
            console.log(err.message)
        });
    }

    render() {
        return (
            <div>
                <StripeCheckout
                    token={this.onToken}
                    stripeKey="pk_test_2BJax9e2RkWuaPNwzsE0ZW07"
                    name="Ethnolink"
                    description="Professional Translation Services"
                    image="././img/logo.jpg"
                    currency="AUD"
                    amount={this.state.cart.totalPrice*100}
                >
                    <button className="btn btn-success">
                        Checkout
                    </button>
                </StripeCheckout>
                <div>
                    {this.state.show? <PaySuccess show={true}/> : null}
                </div>
            </div>


        )
    }
}