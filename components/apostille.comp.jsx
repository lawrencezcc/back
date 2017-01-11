import React from 'react';
import {Jumbotron, Button} from 'react-bootstrap';
import MyAlert from './alert.comp';
import {hashHistory} from 'react-router';


class APComponent extends React.Component {
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
        let path = '';
        let selectedProduct = JSON.parse(localStorage.selectedDocs);
        selectedProduct.comment = selectedProduct.comment === '' ? 'Submitting to DFAT?: ' + this.state.selection + '<br/>' : selectedProduct.comment + 'Submitting to DFAT?: ' + this.state.selection + '<br/>';
        localStorage.selectedDocs = JSON.stringify(selectedProduct);
        if(selectedProduct.document === 'Driver\'s Licence')
        {
            path = '/services/Driver\'s Licence Check';

        }else{
            path = '/services/'+selectedProduct.document;
        }
        hashHistory.push(path);
    }


    render() {
        let styleObj = {
            h3: {
                color: 'white'
            },
            label:{
                color: 'white'
            }
        };

        return (
            <div >
                <Jumbotron>
                    <div className="row col-md-6 col-md-offset-3 ">
                        <h3 style={styleObj.h3}>Do you need to submit your English document and the translation we provide to DFAT for legalisation?</h3>
                        <div className="row col-md-6 col-md-offset-3">
                            <label style={styleObj.label}><input type="radio" name="apo" value="Yes"
                                                                 onChange={this.handleChange}/>Yes&nbsp;&nbsp;</label>
                            <label style={styleObj.label}><input type="radio" name="apo" value="No"
                                                                 onChange={this.handleChange}/>No&nbsp;&nbsp;</label>
                            <label style={styleObj.label}><input type="radio" name="apo" value="Not sure"
                                                                 onChange={this.handleChange}/>Not sure</label>
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

export default APComponent;