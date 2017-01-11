import React from 'react';
import ReactDOM from 'react-dom';
import {Panel,Button,ListGroup,ListGroupItem,InputGroup} from 'react-bootstrap';
import Cart from './cart.comp';
import moment from 'moment-business-days';


class PriceList extends React.Component{
    constructor(){
        super();
        if(localStorage.cart){
            this.state = {
                buttonDisable: false,
                currentCart: {
                    items: JSON.parse(localStorage.cart).items,
                    totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice)
                }
            }
        }else{
            this.state = {
                buttonDisable: false,
                currentCart: {
                    items: [],
                    totalPrice: 0
                }
            }
        }

        this.handleAddToCart = this.handleAddToCart.bind(this);
        // this.add = this.add.bind(this);
        // this.substract = this.substract.bind(this); these two functions combined into edit()
        this.edit = this.edit.bind(this);
    }
    addIndex(arr){
        let newArr = []
        arr.map((item,index)=> {
            item.id = index;
            return newArr[index] = arr[index];
        })
        return newArr;
    }
    calculateTotal(items){
        let sum = 0;
        items.map((item) => {
            sum += item.subTotal;
        });
        return sum;
    }
    handleAddToCart(event){
        const priceInfo = this.props.priceData;// const priceInfo = localStorage.......
        const selectedDoc = JSON.parse(localStorage.selectedDocs);
        let btnId = event.target.id;
        let copyQty = ReactDOM.findDOMNode(this.refs[btnId]).value;//need to do some validation later
        let existCart = [];
        let totalOfCart = this.state.currentCart.totalPrice;
        let item = {};
        let basicPrice = priceInfo[btnId];
        if(window.localStorage && localStorage.cart){
            existCart = JSON.parse(localStorage.cart).items;
        }else{
            existCart = [];
        }
        switch (btnId){
            case 'std':
                item.speed = "regular";
                break;
            case 'exp':
                item.speed = 'express';
                break;
            case 'urg':
                item.speed = 'urgent';
                break;
            default:
                null;
                break;


        }
        item.doc = selectedDoc.document;
        item.sourceLanguage = selectedDoc.sourceLanguage;
        item.targetLanguage = selectedDoc.targetLanguage;
        item.extraCop = copyQty;
        item.comment=selectedDoc.comment;
        item.subTotal = basicPrice + 10 * item.extraCop; //Assume we charge $10 for each extra hard copy.
        existCart.push(item);
        existCart = this.addIndex(existCart);
        totalOfCart = this.calculateTotal(existCart);
        this.setState({
            currentCart: {
                items: existCart,
                totalPrice: totalOfCart
            },
            buttonDisable:true
        })

        localStorage.cart = JSON.stringify(this.state.currentCart);

        event.stopPropagation();
    }
    shouldComponentUpdate(nextProps,nextState){

        this.setState({
            currentCart:nextState.currentCart
        });
        localStorage.cart = JSON.stringify(nextState.currentCart);
        return true;

    }
    componentDidMount(){
        console.log('mount Price component');
        if(localStorage.cart){
            let storedCart = JSON.parse(localStorage.cart);
            if(storedCart.items.length){
                this.setState({currentCart:storedCart});
            }
        }

    }
    componentWillUnmount(){
        this.state.buttonDisable? false: null;
    }
    // add(event){
    //     event.stopPropagation();
    //     let btnId = event.target.id;
    //     let buttonId = '';
    //     switch (btnId){
    //         case 'stdAdd':
    //             buttonId = 'std';
    //             break;
    //         case 'expAdd':
    //             buttonId = 'exp';
    //             break;
    //         case 'urgAdd':
    //             buttonId = 'urg';
    //             break;
    //         default:
    //             null;
    //             break;
    //     }
    //     let inputVal = ReactDOM.findDOMNode(this.refs[buttonId]);
    //
    //     let num = parseInt(inputVal.value);
    //     num +=1;
    //     inputVal.value = num;//to be optimized;
    //
    // }
    edit(event){
        event.stopPropagation();
        let elementId = event.target.id;
        let args = elementId.split(":");
        let priceType = args[0];
        let clickAction = args[1]
        let extraCopyInput = ReactDOM.findDOMNode(this.refs[priceType]);
        let hardCopyQty = parseInt(extraCopyInput.value); // because the value is string so need to be parsed
        if(clickAction === 'add'){
            hardCopyQty += 1;
        }else if(clickAction === 'sub'){
            if(hardCopyQty <= 0){
                return;
            }
            hardCopyQty -= 1;
        }
        extraCopyInput.value = hardCopyQty;

    }
    // substract(event){
    //     event.stopPropagation();
    //     let btnId = event.target.id;
    //
    //     let buttonId = '';
    //     switch (btnId){
    //         case 'stdSub':
    //             buttonId = 'std';
    //             break;
    //         case 'expSub':
    //             buttonId = 'exp';
    //             break;
    //         case 'urgSub':
    //             buttonId = 'urg';
    //             break;
    //         default:
    //             null;
    //             break;
    //     }
    //     let inputVal = ReactDOM.findDOMNode(this.refs[buttonId]);
    //     let num = parseInt(inputVal.value);
    //     num -=1;
    //     if(num < 0){
    //         return;
    //     }
    //     inputVal.value = num;//to be optimized;
    // }
    render() {
        let stdEmailStart=moment().businessAdd(2).format("ddd MMM Do");
        let stdEmailEnd=moment().businessAdd(3).format("ddd MMM Do");
        let stdHardStart=moment().businessAdd(7).format("ddd MMM Do");
        let stdHardEnd=moment().businessAdd(10).format("ddd MMM Do");
        let expEmailStart=moment().businessAdd(2).format("ddd MMM Do");
        let expEmailEnd=moment().businessAdd(3).format("ddd MMM Do");
        let expHardStart=moment().businessAdd(3).format("ddd MMM Do");
        let expHardEnd=moment().businessAdd(5).format("ddd MMM Do");
        let urgEmailStart=moment().businessAdd(1).format("ddd MMM Do");
        let urgHardStart=moment().businessAdd(2).format("ddd MMM Do");
        let urgHardEnd=moment().businessAdd(3).format("ddd MMM Do");
        let StyleObj = {
            tab:{margin: '20px'},

        };
        return(
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <Panel header="Standard" bsStyle="success" style={StyleObj.tab}>
                            <ListGroup fill>
                                <ListGroupItem><strong>${this.props.priceData.std}</strong></ListGroupItem>
                                <ListGroupItem>Estimate Email copy delivery:<br/>{stdEmailStart}-{stdEmailEnd}</ListGroupItem>
                                <ListGroupItem>Estimate Hard copy delivery:<br/>{stdHardStart}-{stdHardEnd}</ListGroupItem>
                                <ListGroupItem>with 1 hard copy</ListGroupItem>
                                <ListGroupItem >
                                    Extra Copy
                                    <InputGroup>
                                        <InputGroup.Button>
                                            <Button bsStyle="info" onClick={this.edit} id="std:sub">-</Button>
                                            {/*<Button bsStyle="info" onClick={this.add} id="stdAdd">+</Button>*/}
                                        </InputGroup.Button>
                                        <input type="text" className="form-control" ref="std" defaultValue="0"/>
                                        <InputGroup.Button>
                                            <Button bsStyle="info" onClick={this.edit} id="std:add">+</Button>
                                            {/*<Button bsStyle="info" onClick={this.substract} id="stdSub">-</Button>*/}
                                        </InputGroup.Button>
                                    </InputGroup>

                                </ListGroupItem>
                                <ListGroupItem><Button onClick={this.handleAddToCart} disabled={this.state.buttonDisable} id="std" bsStyle="info"><span className='glyphicon glyphicon-shopping-cart'></span>add to cart</Button></ListGroupItem>
                            </ListGroup>
                        </Panel>
                    </div>
                    <div className="col-md-4">
                    <Panel header="Express" bsStyle="success" style={StyleObj.tab}>
                        <ListGroup fill>
                            <ListGroupItem><strong>${this.props.priceData.exp}</strong></ListGroupItem>
                            <ListGroupItem>Estimate Email copy delivery:<br/>{expEmailStart}-{expEmailEnd}</ListGroupItem>
                            <ListGroupItem>Estimate Hard copy delivery:<br/>{expHardStart}-{expHardEnd}</ListGroupItem>
                            <ListGroupItem>with 1 hard copy</ListGroupItem>
                            <ListGroupItem>
                                Extra Copy
                                <InputGroup>
                                    <InputGroup.Button>
                                        {/*<Button bsStyle="info" onClick={this.add} id="expAdd">+</Button>*/}
                                        <Button bsStyle="info" onClick={this.edit} id="exp:sub">-</Button>
                                    </InputGroup.Button>
                                    <input className="form-control" type="text" ref="exp" defaultValue="0"/>
                                    <InputGroup.Button>
                                        {/*<Button bsStyle="info" onClick={this.substract} id="expSub">-</Button>*/}
                                        <Button bsStyle="info" onClick={this.edit} id="exp:add">+</Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </ListGroupItem>
                            <ListGroupItem><Button onClick={this.handleAddToCart} disabled={this.state.buttonDisable} id="exp" bsStyle="info"><span className='glyphicon glyphicon-shopping-cart'></span>add to cart</Button></ListGroupItem>
                        </ListGroup>
                    </Panel>
                    </div>
                    <div className="col-md-4">
                    <Panel header="Urgent" bsStyle="success" style={StyleObj.tab}>
                        <ListGroup fill>
                            <ListGroupItem><strong>${this.props.priceData.urg}</strong></ListGroupItem>
                            <ListGroupItem>Estimate Email copy delivery:<br/>{urgEmailStart}</ListGroupItem>
                            <ListGroupItem>Estimate Hard copy delivery:<br/>{urgHardStart}-{urgHardEnd}</ListGroupItem>
                            <ListGroupItem>with 1 hard copy</ListGroupItem>
                            <ListGroupItem>
                                Extra Copy
                                <InputGroup>
                                    <InputGroup.Button>
                                        {/*<Button bsStyle="info"  onClick={this.add} id="urgAdd">+</Button>*/}
                                        <Button bsStyle="info" onClick={this.edit} id="urg:sub">-</Button>
                                    </InputGroup.Button>
                                    <input className="form-control" type="text" ref="urg" defaultValue="0"/>
                                    <InputGroup.Button>
                                        {/*<Button bsStyle="info"  onClick={this.substract} id="urgSub">-</Button>*/}
                                        <Button bsStyle="info" onClick={this.edit} id="urg:add">+</Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </ListGroupItem>
                            <ListGroupItem><Button onClick={this.handleAddToCart} disabled={this.state.buttonDisable} id="urg" bsStyle="info"><span className='glyphicon glyphicon-shopping-cart'></span>add to cart</Button></ListGroupItem>
                        </ListGroup>
                    </Panel>
                    </div>
                </div>
                <div className="col-md-3 pull-right" >
                    <Cart  panelStyle={StyleObj} cartData={this.state.currentCart} />
                </div>
            </div>
        )
    }
}




export default PriceList;