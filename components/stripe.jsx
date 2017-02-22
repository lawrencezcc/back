import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import PaySuccess from './alerts/paymentsuccessAlert';
import PostageAlert from './alerts/postageAlert';
import Loading from 'react-loading';
import * as consts from '../constants';

export default class Stripe extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            show:false,
            postageAlert:false,
            loading:false
        };
        this.onToken=this.onToken.bind(this);
        this.checkPostage=this.checkPostage.bind(this);
    }

    closeAlert(){
        this.setState({
            postageAlert:false
        });
    }

    checkPostage(e){
        if (this.props.update()){
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (this.props.cartData.postageType===undefined){
            e.preventDefault();
            e.stopPropagation();
            this.setState({
                postageAlert:true
            })
            return false;
        }else{
            return;
        }

    }
    onToken(token) {

        this.setState({
            loading:true
        })
        let upData = new FormData();
        upData.append("amount",this.props.cartData.totalPrice*100);
        upData.append("email",token.email);
        upData.append("token",token.id);
        axios.post(consts.API_URL + '/charge',upData)
            .then(response => {
                if (response.status===200){
                    console.log(response);
                    localStorage.order = JSON.stringify(response.data.Ordernumber);
                    this.setState({show:true,loading:false});
                }
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
                    image="../img/logo.jpg"
                    currency="AUD"
                    amount={this.props.cartData.totalPrice*100}
                >
                    <button className="btn btn-success" onClick={this.checkPostage}>
                        Checkout
                    </button>
                </StripeCheckout>
                <div>
                    {this.state.show? <PaySuccess show={true}/> : null}
                    {this.state.postageAlert? <PostageAlert show={true} close={this.closeAlert.bind(this)}/> : null}
                </div>
                <div className="loading">
                    {this.state.loading? <Loading type='spin' color='#e3e3e3' height={150} width={150}/> : null}
                </div>
            </div>


        )
    }
}