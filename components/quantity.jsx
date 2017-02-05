import React from 'react';
import {Button} from 'react-bootstrap';
import {hashHistory} from 'react-router';

class QuantityComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            src: JSON.parse(localStorage.selectedDocs).sourceLanguage,
            tar: JSON.parse(localStorage.selectedDocs).targetLanguage,
            type: JSON.parse(localStorage.selectedDocs).document
        }
    };

    handleRedir(button) {
        let selectedProduct = JSON.parse(localStorage.selectedDocs);
        selectedProduct.quantity = parseInt(button.id)

        let path = '/services/' + selectedProduct.document;
        if (window.localStorage) {
            localStorage.selectedDocs = JSON.stringify(selectedProduct);
        } else {
            alert('Your browser does not support localStorage');
            return;
        }
        hashHistory.push(path);
        event.stopPropagation();

    }

    render() {
        const buttonNumber = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]
        const buttons = buttonNumber.map((button) => {
            return (
                <Button bsStyle="success" onClick={this.handleRedir.bind(this, button)}
                        id={button.id} key={button.id}>{button.id}</Button>
            )
        })

        return (
            <div className="jumbotron row">
                <h1>Order your NATTI Certified Translation Online!</h1>
                <div className="form-group divborder col-sm-8 ">
                    <div className="form-group">
                        <p>How many different <b>{this.state.type}</b> would you like to have translated from <b>{this.state.src} to {this.state.tar}</b></p>
                    </div>
                    <div className="form-inline btn-group">
                        {buttons}
                    </div>
                </div>
            </div>
        )
    }
}


export default QuantityComponent;