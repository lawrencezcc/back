import React from 'react';
import {Button} from 'react-bootstrap';
import {hashHistory} from 'react-router';
import PubSub from 'pubsub-js';


class AddMoreDocComponent extends React.Component{

    constructor() {
        super();
    }

    handleNo(){
        hashHistory.push('/cart');
    }

    handleYes(){
        hashHistory.push('/services');
    }

    componentDidMount(){

        PubSub.publishSync("steps", 1);
    }
    render(){

        return(
            <div>
                <div className="jumbotron row">
                    <h1>Order your NATTI Certified Translation Online!</h1>
                    <div className="form-group divborder col-sm-8 ">
                        <div className="form-group" >
                            <p className="media-middle">Your order has been added</p>
                            <p className="media-middle">Do you need any more documents translated?</p>
                        </div>
                        <div className="btn-group btn-group-justified form-inline">
                            <div className="btn-group">
                            <Button bsStyle="warning" onClick={this.handleYes.bind(this)}
                                    id="yes" className="btn btn-default">Yes, add more documents</Button></div>
                            <div className="btn-group">
                            <Button bsStyle="success" onClick={this.handleNo.bind(this)}
                                    id="no" className="btn btn-default">Checkout</Button></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default AddMoreDocComponent;