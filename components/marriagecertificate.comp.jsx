import React from 'react';
import {Jumbotron, Button} from 'react-bootstrap';
import {hashHistory} from 'react-router';


class MCComponent extends React.Component {
    constructor() {

        super();
        this.state = {
            selection: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
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
        let path = '/services/quality';
        hashHistory.push(path);
    }


    render() {

        return (
            <div >
                <Jumbotron>
                    <div className="row col-md-6 col-md-offset-3 ">
                        <h3>Do you need your marriage certificate translated into English for an
                            application for divorce?</h3>
                        <div className="row col-md-6 col-md-offset-3">
                            <label><input type="radio" name="divorce" value="Yes"
                                                              onChange={this.handleChange}/>Yes&nbsp;&nbsp;</label>
                            <label><input type="radio" name="divorce" value="No"
                                                              onChange={this.handleChange}/>No</label>
                        </div>
                    </div>
                    <div className="row col-md-6 col-md-offset-3 ">
                        <Button bsStyle="primary" block onClick={this.handleProceed}>
                            Proceed
                        </Button>
                    </div>
                </Jumbotron>

            </div>
        )
    }
}

export default MCComponent;