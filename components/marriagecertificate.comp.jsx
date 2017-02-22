import React from 'react';
import {Button} from 'react-bootstrap';
import {hashHistory} from 'react-router';
import PubSub from 'pubsub-js';


class MCComponent extends React.Component {
    constructor() {

        super();
        this.state = {
            selection: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
    }

    componentDidMount(){
        PubSub.publishSync("steps", 1);
    }

    handleChange(event) {
        let r = event.currentTarget.value;
        if (r === '') {
            this.state.selection = '';
            return;
        }
        this.state.selection = r;
    };

    handleProceed() {
        if (this.state.selection === '') {
            alert('please choose the answer');
            return;
        }
        let selectedProduct = JSON.parse(localStorage.selectedDocs);
        selectedProduct.comment = selectedProduct.comment === '' ? 'Affidavit Required?: ' + this.state.selection : selectedProduct.comment + 'Affidavit Required?: ' + this.state.selection
        localStorage.selectedDocs = JSON.stringify(selectedProduct);
        let path = '/services/quantity';
        hashHistory.push(path);
    }


    render() {

        return (
            <div >
                <div>
                    <h3>Do you need your marriage certificate translated into English for an
                        application for divorce?</h3>
                    <div>
                        <label><input type="radio" name="divorce" value="Yes"
                                      onChange={this.handleChange}/>Yes&nbsp;&nbsp;</label>
                        <label><input type="radio" name="divorce" value="No"
                                      onChange={this.handleChange}/>No</label>
                    </div>
                </div>
                <div>
                    <Button bsStyle="primary" block onClick={this.handleProceed}>
                        Proceed
                    </Button>
                </div>
            </div>
        )
    }
}

export default MCComponent;