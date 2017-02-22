import React from 'react';
import {Button} from 'react-bootstrap';
import {hashHistory} from 'react-router';
import PubSub from 'pubsub-js';


class APComponent extends React.Component {
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
        let path = '';
        let selectedProduct = JSON.parse(localStorage.selectedDocs);
        selectedProduct.comment = selectedProduct.comment === '' ? 'Submitting to DFAT?: ' + this.state.selection + '<br/>' : selectedProduct.comment + 'Submitting to DFAT?: ' + this.state.selection + '<br/>';
        localStorage.selectedDocs = JSON.stringify(selectedProduct);
        if(selectedProduct.document === 'Driver\'s Licence')
        {
            path = '/services/Driver\'s Licence Check';

        }else{
            path = '/services/quantity';
        }
        hashHistory.push(path);
    }


    render() {
        return (
            <div >
                    <div>
                        <h3>Do you need to submit your English document and the translation we provide to DFAT for legalisation?</h3>
                        <div>
                            <label><input type="radio" name="apo" value="Yes"
                                                                 onChange={this.handleChange}/>Yes&nbsp;&nbsp;</label>
                            <label><input type="radio" name="apo" value="No"
                                                                 onChange={this.handleChange}/>No&nbsp;&nbsp;</label>
                            <label><input type="radio" name="apo" value="Not sure"
                                                                 onChange={this.handleChange}/>Not sure</label>
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

export default APComponent;