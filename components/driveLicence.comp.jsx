import React from 'react';
import { Jumbotron,Button } from 'react-bootstrap';
import MyAlert from './alert.comp';
import { hashHistory } from 'react-router';


class DLComponent extends React.Component{
    constructor(){

        super();
        this.state = {

            stateUse: '',
            reasons: '',
            alert: false,
            buttonDisable: false,
            stateDisplay: false,
            otherDisplay: false,
            otherReason: ''
        };
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleReasonChange = this.handleReasonChange.bind(this);
        this.handleOtherChange = this.handleOtherChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);


    }

    handleOtherChange(event){
        let o = event.target.value;
        if(o === ''){
            this.state.otherReason= '';
            return;
        }
        this.state.otherReason = o;
        event.stopPropagation();
    }

    handleStateChange(event){
        let s = event.target.value;
        if(s === 'selected'){
            this.state.stateUse = '';
            return;
        }
        this.state.stateUse = s;
        let selectedState = this.state.stateUse;
        let selectedReason = this.state.reasons;
        if(selectedState === 'nsw' && selectedReason === 'Apply for an Australian licence'){
            this.setState({alert: true,buttonDisable:true});
        }else{
            this.setState({alert:false,buttonDisable:false});
        }
        event.stopPropagation();

    }
    handleReasonChange(event){
        let r = event.target.value;
        if(r === 'selected'){
            this.state.reasons = '';
            return;
        }
        this.state.reasons = r;
        let selectedState = this.state.stateUse;
        let selectedReason = this.state.reasons;
        if (selectedReason === 'Apply for an Australian licence'){
            this.setState({stateDisplay: true})
        }else{
            this.setState({stateDisplay: false})
        }
        if (selectedReason === 'other'){
            this.setState({otherDisplay: true})
        }else {
            this.setState({otherDisplay: false})
        }

        if(selectedState === 'nsw' && selectedReason === 'Apply for an Australian licence'){
            this.setState({alert: true,buttonDisable:true});
        }else{
            this.setState({alert:false,buttonDisable:false});
        }
        event.stopPropagation();
    };

    handleProceed(){
        let selectedProduct = JSON.parse(localStorage.selectedDocs);
        if(this.state.reasons === '' ||
            this.state.reasons ==='Apply for an Australian licence' && this.state.stateUse === ''){
            alert('please select the state or reason');
            return;
        }

        if(this.state.reasons ==='other' && this.state.otherReason===''){
            alert('please specify the reason');
            return;
        }

        switch (this.state.reasons){
            case 'Apply for an Australian licence':
                selectedProduct.comment += 'Licence Translation Use: '+this.state.reasons+' in '+this.state.stateUse;
                break;
            case 'other':
                selectedProduct.comment += 'Licence Translation Use: '+this.state.otherReason;
                break;
            default:
                selectedProduct.comment += 'Licence Translation Use: '+this.state.reasons;
                break;
        }

        localStorage.selectedDocs = JSON.stringify(selectedProduct);

        let path ='/services/Driver\'s Licence';
        hashHistory.push(path);
    }


    render() {
        let styleObj = {
            h3:{
                color:'white'
            }
        };

        return(
            <div >
                <Jumbotron>
                    <div className="row col-md-6 col-md-offset-3 " >
                        <h3 style={styleObj.h3}>Why do you need your licence translated</h3>
                        <select name="state" id="state" onChange={this.handleReasonChange} className="form-control" defaultValue="selected">
                            <option value="selected">Choose a reason</option>
                            <option value="Apply for an Australian licence">I want to get Australian's Licence</option>
                            <option value="Drive in Australia on a holiday">Driving in Australia on a holiday</option>
                            <option value="Rent a car on a holiday">Rent a car on a holiday</option>
                            <option value="other">Other Reason</option>
                        </select>
                    </div>
                    <div className={this.state.otherDisplay ? "row col-md-6 col-md-offset-3 " : "hidden"}>
                        <br/>
                        <input type="text" id="other" name="other" maxLength="45" label="Other reason" placeholder="Please specify" onChange={this.handleOtherChange}/>
                        <br/>
                    </div>
                    <div className={this.state.stateDisplay ? "row col-md-6 col-md-offset-3 " : "hidden"}>
                        <h3 style={styleObj.h3}>Which state you are going to use this licence</h3>
                        <select name="state" id="state" onChange={this.handleStateChange} defaultValue="selected" className="form-control">
                            <option value="selected">Select s State</option>
                            <option value="NSW">NSW</option>
                            <option value="VIC">VIC</option>
                            <option value="QLD">QLD</option>
                            <option value="SA">SA</option>
                            <option value="WA">WA</option>
                            <option value="ACT">ACT</option>
                            <option value="NT">NT</option>
                        </select>
                    </div>
                    <div className="row col-md-6 col-md-offset-3 " >
                    <Button bsStyle="primary" block disabled={this.state.buttonDisable} onClick={this.handleProceed}>
                            Proceed
                        </Button>
                    </div>
                    <div className="row col-md-6 col-md-offset-3" >
                        {this.state.alert? <MyAlert/> : null}
                    </div>
                </Jumbotron>

            </div>
        )
    }
}

export default DLComponent;