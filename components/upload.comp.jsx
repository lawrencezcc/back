import React, {PropTypes} from 'react';
import axios from 'axios';
import * as consts from '../constants';
import ReactDOM from 'react-dom';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import Stripe from './stripe';

const {Input, Select, Textarea} = FRC;

const MyForm = React.createClass({

    mixins: [FRC.ParentContextMixin],

    propTypes: {
        children: React.PropTypes.node
    },

    render() {
        return (
            <Formsy.Form
                className={this.getLayoutClassName()}
                {...this.props}
                ref="formsy"
            >
                {this.props.children}
            </Formsy.Form>
        );
    }

});

class DocUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cart: {
                items: this.props.cart.items,
                totalPrice: this.props.cart.totalPrice,
            },
            uploadFiles: [],
            canSubmit: false,
            email: "",
            orderNumber: "",
            upData:{},
        }

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.uploadItem = this.uploadItem.bind(this);
        this.addressFields = this.addressFields.bind(this);
        this.emailChange = this.emailChange.bind(this);
    }

    emailChange(name, value) {
        this.setState({email: value})
    }

    enableButton() {
        this.setState({
            canSubmit: true
        });
    }

    disableButton() {
        this.setState({
            canSubmit: false
        });
    }

    handleFileChange(item, event) {
        console.log(event.target.id);
        let fileName = item.doc;
        let file = {};
        let currentFileObject = this.state.uploadFiles;
        currentFileObject = currentFileObject.filter(file => file.id != event.target.id);
        file.fileList = event.target.files;
        file.id = event.target.id;
        file.name = fileName;
        file.src = item.sourceLanguage;
        file.tar = item.targetLanguage;
        file.spd = item.speed;
        file.unitPrice = item.unitPrice;
        file.subtotal = item.subTotal;
        file.extra = item.extraCop;
        file.comment = item.comment
        if (file.fileList.length != 0) currentFileObject.push(file);
        console.log(currentFileObject)
        this.setState({
            uploadFiles: currentFileObject
        })

    }

    handleSubmit(event) {
        let formData = ReactDOM.findDOMNode(this.refs.myForm);
        let upData = new FormData();
        let updataArr = this.state.uploadFiles;
        let count = 0;
        updataArr.map((fileObj) => {

            for (let i = 0; i < fileObj.fileList.length; i++) {
                let extension = fileObj.fileList.item(i).name.split('.')[1];
                upData.append('files[]', fileObj.fileList.item(i), fileObj.name + '-' + fileObj.src + '-' + fileObj.tar + '-' + fileObj.extra + '-' + fileObj.spd + '-' + (parseInt(fileObj.extra) * 11 + parseInt(fileObj.unitPrice)) + '-' + fileObj.comment + '-' + count + ',' + i + '.' + extension);
            }
            count += 1;
        });
        upData.append("postageType", this.props.cart.postageType);
        upData.append("fullName", formData['full-name'].value);
        upData.append("mobile", formData['mobile'].value);
        upData.append("email", formData['email'].value);
        upData.append("cart",JSON.stringify(this.props.cart.items));
        upData.append("digitalcopydate",this.props.cart.items[0].date);
        if (this.props.cart.postageType !== "No Hard Copy") {
            upData.append("address1", formData['street-address'].value);
            upData.append("address2", formData['street-address2'].value);
            upData.append("suburb", formData['suburb'].value);
            upData.append("state", formData['state'].value);
            upData.append("postcode", formData['postcode'].value);
            upData.append("hardcopydate",this.props.cart.hardCopyDate);
        }
        upData.append("comment", formData['comment'].value);
        upData.append("totalprice", this.props.cart.totalPrice);
        this.setState({
            upData:upData
        })
        axios.post(consts.API_URL + '/upload', upData)
            .then((response) => {
                console.log(JSON.stringify(response.data))
                this.setState({
                    orderNumber:response.data.Ordernumber
                }, () => {
                    console.log(this.state);
                })

            })
            .catch((err) => {
                console.log(err.message)
            });
    }

    uploadItem(item, index) {
        const nth = ["first", "second", "third", "fourth", "fifth"]
        let container = [];
        for (var i = 0; i < item.quantity; i++) {
            container.push(<div key={"div-" + index + "-" + i}><label key={"label-" + index + "-" + i}
                                                                      htmlFor={"item-" + index + "-" + i}>Upload ALL
                pages for {nth[i]} {item.doc} </label>
                <input className="file-input btn btn-info form-control" type="file"
                       id={"item-" + index + "-" + i}
                       name='doc[]' multiple key={"item-" + index + "-" + i}
                       onChange={(event) => this.handleFileChange(item, event)}
                /></div>
            );
        }
        return container;
    }

    uploadInput() {
        return (
            this.state.cart.items.map((item, index) => {
                return (
                    <div className="form-group" key={index}>
                        <h4>{item.doc}</h4>
                        {this.uploadItem(item, index)}
                    </div>
                )
            })
        );
    }

    addressFields() {
        if (this.props.cart.postageType === "No Hard Copy") {
            return (<div></div>);
        } else {
            let statesOptions = [
                {value: '', label: 'Please select...'},
                {value: 'act', label: 'Australian Capital Territory'},
                {value: 'nsw', label: 'New South Wales'},
                {value: 'nt', label: 'Northern Territory'},
                {value: 'qld', label: 'Queensland'},
                {value: 'sa', label: 'South Australia'},
                {value: 'tas', label: 'Tasmania'},
                {value: 'vic', label: 'Victoria'},
                {value: 'wa', label: 'Western Australia'}
            ];
            let singleSelectOptions = statesOptions.slice(0);
            return (
                <div>
                    <Input type="text" ref="street-address" name="street-address"
                           label="Street address" required placeholder="Street Address" value=""
                    />
                    <Input type="text" ref="street-address2" name="street-address2"
                           label="Address line2" placeholder="Street Address Line2 (if required)" value=""
                    />
                    <Input type="text" ref="suburb" name="suburb"
                           label="Suburb" placeholder="Suburb" required value=""
                    />

                    <Select name="state" ref="state" label="State/Territory" required value=""
                            options={singleSelectOptions}/>

                    <Input type="text" ref="postcode" name="postcode"
                           label="Postcode" placeholder="Postcode" required
                           validations="isLength:4" value=""
                           validationError="Four digital number"
                    />
                </div>
            );
        }
    }

    render() {
        return (
            <div className="jumbotron text-center">
                <h1>Upload your documents</h1>
                <MyForm onSubmit={this.handleSubmit} encType="multipart/form-data" method="POST"
                        ref="myForm" id="myForm" name="myForm" onInvalid={this.disableButton}
                        onValid={this.enableButton}
                >
                    {this.uploadInput()}
                    <div className="form-group">
                        <Input type="text" validations="isWords"
                               validationError="Alphabets only" ref="full-name" name="full-name"
                               required placeholder="Full name." value=""
                               label="Full name"
                        />
                        <Input type="text" ref="mobile" name="mobile"
                               label="Mobile Number" placeholder="Mobile Number" value=""
                        />
                        <Input type="text" ref="email" name="email" validations="isEmail"
                               validationError="This is not a valid email" required value=""
                               label="Email" placeholder="Email" onChange={this.emailChange}
                        />
                        <Input type="text" ref="email-check" name="email-check"
                               validations="equalsField:email" validationError="Email not match"
                               label="Confirm Email" placeholder="Confirm Email" required value=""
                        />
                        {this.addressFields()}
                        <Textarea ref="comment" name="comment" rows={2} placeholder="Comments for these documents
                            .e.g where are you going to use driver's licence" label="Other comment for the services"
                                  value=""
                        />
                    </div>
                    <div className="btn-group">
                        <Stripe cartData={this.props.cart} submit={this.handleSubmit} update={this.props.update}
                                disabled={!this.state.canSubmit} email={this.state.email}
                                orderNumber={this.state.orderNumber} updata={this.state.upData}/>
                    </div>
                </MyForm>
            </div>
        )
    }

}


export default DocUpload;