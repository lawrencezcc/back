import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import PaySuccess from './alerts/paymentsuccessAlert';
import Loading from 'react-loading';
import * as consts from '../constants';

export default class Stripe extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            cart:{
                items: props.cartData.items,
                totalPrice: props.cartData.totalPrice
            },
            show:false,
            loading:false
        };
        this.onToken=this.onToken.bind(this);
    }

    onToken(token) {
        this.setState({
            loading:true
        })
        let upData = new FormData();
        upData.append("amount",this.state.cart.totalPrice*100);
        upData.append("email",token.email);
        upData.append("token",token.id);
        axios.post(consts.API_URL + '/charge',upData)
            .then(response => {
                if (response.status===200){
                    localStorage.order = JSON.stringify(response.data.Ordernumber);
                    this.setState({show:true,loading:false});
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
                <div className="loading">
                    {this.state.loading? <Loading type='spin' color='#e3e3e3' height={150} width={150}/> : null}
                </div>
            </div>


        )
    }
}