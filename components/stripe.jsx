import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import Button from 'react-bootstrap';

class Stripe extends React.Component {
    onToken(token) {
/*        axios.post('http://localhost:5000/charge', {
            body: JSON.stringify(token),
        }).then(response => {
            response.json().then(data => {
                alert(`We are in business, ${data.email}`);
            });
        });*/
    console.log("save");
    }

    // ...

    render() {
        return (
            <StripeCheckout
                token={this.onToken}
                stripeKey="pk_test_2BJax9e2RkWuaPNwzsE0ZW07"
                name="Ethnolink"
                description="Professional Translation Services"
                image="http://www.ethnolink.com.au/templates/theme530/images/logo.png"
                currency="AUD"
                amount={1000}
            >
                <Button bsStyle="success">CheckOut</Button>
            </StripeCheckout>
        )
    }
}

export default Stripe;
