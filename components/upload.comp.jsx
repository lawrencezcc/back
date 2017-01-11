import React,{PropTypes} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const  { Input,Select, File, Textarea} = FRC;

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

    constructor(props){
        super(props);
        this.state = {
            cart: {
                items:[],
                totalPrice: 0
            },
            uploadFiles: [],
            canSubmit: false
        }
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
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

    componentDidMount(){
        if(localStorage.cart) {
            this.setState({
                cart:{
                    items: JSON.parse(localStorage.cart).items,
                    totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice)
                }
            });
        }
    }

    handleFileChange(item,event,id){
        let fileName = item.doc;
        let file = {};
        let currentFileObject = this.state.uploadFiles;
        currentFileObject=currentFileObject.filter(file => file.id != id);
        file.fileList = event.target.files;
        file.id = id;
        file.name = fileName;
        file.src = item.sourceLanguage;
        file.tar = item.targetLanguage;
        file.spd = item.speed;
        file.subtotal = item.subTotal;
        file.extra = item.extraCop;
        file.comment = item.comment
        if (file.fileList.length!=0) currentFileObject.push(file);
        console.log(currentFileObject)
        this.setState({
            uploadFiles: currentFileObject
        })

    }
    handleSubmit(event){
        let formData = ReactDOM.findDOMNode(this.refs.myForm);
        let upData = new FormData();
        let updataArr = this.state.uploadFiles;
        updataArr.map((fileObj) =>{
            for(let i = 0; i<fileObj.fileList.length; i++){
                let extension = fileObj.fileList.item(i).name.split('.')[1];
                upData.append('files[]',fileObj.fileList.item(i),fileObj.name+'-'+fileObj.src+'-'+fileObj.tar+'-'+fileObj.extra+'-'+fileObj.spd+'-'+fileObj.subtotal+'-'+fileObj.comment+'-'+i+'.'+extension);
            }

        });
        upData.append("fullName",formData['full-name'].value)
        upData.append("mobile",formData['mobile'].value);
        upData.append("email",formData['email'].value);
        upData.append("address1",formData['street-address'].value);
        upData.append("address2",formData['street-address2'].value);
        upData.append("suburb",formData['suburb'].value);
        upData.append("state",formData['state'].value);
        upData.append("postcode",formData['postcode'].value);
        upData.append("comment",formData['comment'].value);
        upData.append("totalprice",this.state.cart.totalPrice);


        axios.post('http://localhost:5000/upload',upData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err.message)
            });

        // this.state.cart.items.map((item,index) => {
        //     console.log(upData.getAll(item.doc+'-docs[]'));
        //     upData.set(item.doc+'-docs[]',upData.getAll(item.doc+'-docs[]'),)
        // });

        //console.log(upData.getAll('doc[]'));

    }

    uploadInput(){
        return(
            this.state.cart.items.map((item,index) => {
                return(
                    <div className="form-group" key={index}>
                        <h4>{item.doc}</h4>
                        <input className="file-input btn btn-info form-control" type="file" id={"item-"+index}
                               name='doc[]'  multiple onChange={(event) =>this.handleFileChange(item, event,item.id)}
                               label={item.doc}
                        />
                    </div>
                )
            })
        );
    }

    render() {
        let statesOptions= [
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
            <div className="jumbotron text-center" >
                <h1>Upload your documents</h1>
                <MyForm onSubmit={this.handleSubmit} encType="multipart/form-data" method="POST"
                        ref="myForm"  id="myForm" name="myForm" onInvalid={this.disableButton}
                        onValid={this.enableButton}
                    >
                    {this.uploadInput()}
                    <div className="form-group">
                        <Input type="text" validations="isWords"
                               validationError="Alphabets only" ref="full-name" name="full-name"
                               required placeholder="Full name."
                               label="Full name"
                        />
                        <Input type="text" ref="mobile" name="mobile"   required
                               label="Mobile Number" placeholder="Mobile Number"
                        />
                        <Input type="text" ref="email" name="email"  validations="isEmail"
                               validationError="This is not a valid email" required
                               label="Email" placeholder="Email"
                        />
                        <Input type="text" ref="email-check" name="email-check"
                               validations="equalsField:email" validationError="Email not match"
                               label="Confirm Email" placeholder="Confirm Email"
                        />
                        <Input type="text" ref="street-address" name="street-address"
                               label="Street address" required placeholder="Street Address"
                        />
                        <Input type="text" ref="street-address2" name="street-address2"
                               label="Address line2" placeholder="Street Address Line2 (if required)"
                        />
                        <Input type="text" ref="suburb" name="suburb"
                               label="Suburb" placeholder="Suburb" required
                        />

                        <Select name="state" ref="state" label="State/Territory" required options={singleSelectOptions}/>

                        <Input type="text" ref="postcode" name="postcode"
                               label="Postcode" placeholder="Postcode" required
                               validations="isLength:4"
                               validationError="Four digital number"
                        />
                        <Textarea ref="comment"  name="comment" rows={2} placeholder="Comments for these documents
                            .e.g where are you going to use driver's licence" label="Other comment for the services"
                        />
                    </div>

                    <div className="form-group">
                        <input type="submit" className="btn btn-success form-control" value="Upload" disabled={!this.state.canSubmit}/>
                    </div>

                </MyForm>
            </div>
        )
    }

}


export default DocUpload;