import React from 'react';
import {Button} from 'react-bootstrap';
import {hashHistory} from 'react-router';
import PubSub from 'pubsub-js';

class NeedExtraCopyComponent extends React.Component{

    constructor() {
        super();
    }

    componentDidMount(){
        PubSub.publishSync("steps",1);
    }


    handleNo(){
        hashHistory.push('/addMoreDoc');
    }

    handleYes(){
        hashHistory.push('/extraCopy');
    }

    render(){

        return(
            <div>
                <div className="jumbotron row">
                    <h1>Order your NATTI Certified Translation Online!</h1>
                    <div className="form-group divborder col-sm-8 ">
                        <div className="form-group" >
                            <p className="media-middle">Your order has been added!</p>
                            <p className="media-middle">Your order includes 1 hard copy.<br/><b>Would you like to order and extra hard copy for $11?</b></p>
                        </div>
                        <div className="btn-group btn-group-justified form-inline">
                            <div className="btn-group">
                            <Button bsStyle="warning" onClick={this.handleNo.bind(this)}
                                    id="no" className="btn btn-default">No extra copies</Button></div>
                            <div className="btn-group">
                            <Button bsStyle="success" onClick={this.handleYes.bind(this)}
                                    id="yes" className="btn btn-default">Yes, I want extra hard copies</Button></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default NeedExtraCopyComponent;