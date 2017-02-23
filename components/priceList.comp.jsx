import React from 'react';
import {Panel, Button, ListGroup, ListGroupItem, Glyphicon} from 'react-bootstrap';
import SpeedAlert from './alerts/speedAlert';
import moment from 'moment-business-days';
import momentTimeZone from 'moment-timezone';
import PubSub from 'pubsub-js';
import {hashHistory} from 'react-router';

class PriceList extends React.Component {
    constructor(props) {
        super(props);
        if (localStorage.cart) {
            this.state = {
                buttonDisable: false,
                currentCart: {
                    items: JSON.parse(localStorage.cart).items,
                    totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice),
                    postageType: JSON.parse(localStorage.cart).postageType
                },
                selectedDoc: JSON.parse(localStorage.selectedDocs),
                speedalert: false,
                nextday: momentTimeZone().tz("Australia/Sydney").hour() >= 17 ? 1 : 0,
                urgAvailable:(this.props.priceData.urgAvail==true)
            }
        } else {
            this.state = {
                buttonDisable: false,
                currentCart: {
                    items: [],
                    totalPrice: 0
                },
                selectedDoc: JSON.parse(localStorage.selectedDocs),
                speedalert: false,
                nextday: moment().local().hour() >= 17 ? 1 : 0,
                urgAvailable: (this.props.priceData.urgAvail==true)
            }
        }

        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.checkSpeed = this.checkSpeed.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.renderUrgent = this.renderUrgent.bind(this);
    }

    addIndex(arr) {
        let newArr = []
        arr.map((item, index) => {
            item.id = index;
            return newArr[index] = arr[index];
        })
        return newArr;
    }

    calculateTotal(items) {
        let sum = 0;
        items.map((item) => {
            sum += item.subTotal;
        });
        return sum;
    }

    checkSpeed(speed, cart,event) {
        for (var i in cart) {
            console.log(speed);
            console.log(cart[i].speed);
            if (cart[i].speed !== speed ) {
                event.preventDefault();
                event.stopPropagation();
                this.setState({speedalert: true});
                return false;
            }
        }
        return true;
    }

    closeAlert(){
        this.setState({
            speedalert:false
        });
    }

    renderUrgent(){
        let StyleObj = {
            tab: {margin: '2px'},
        };
        if (this.props.priceData.urgAvail){
            let urgDate = moment().businessAdd(1 + this.state.nextday).format("ddd MMM Do");
            return(
                <Panel header="Urgent" bsStyle="danger" style={StyleObj.tab}>
                    <ListGroup fill>
                        <ListGroupItem><strong>${this.props.priceData.urg * this.state.selectedDoc.quantity}
                            ({this.props.priceData.urg}Each)</strong></ListGroupItem>
                        <ListGroupItem>Email Delivery Date<br/>{urgDate} 5pm<br/>(1 Business
                            day)<br/></ListGroupItem>
                        <Button onClick={this.handleAddToCart} disabled={this.state.buttonDisable} id="urg"
                                bsStyle="danger">Order</Button>
                    </ListGroup>
                </Panel>
            )
        }else{
            return(
                <Panel header="Urgent" bsStyle="danger" style={StyleObj.tab}>
                    <ListGroup fill>
                        <ListGroupItem><strong>Not Available</strong></ListGroupItem>
                        <ListGroupItem><br/>Please select other methods<br/><br/></ListGroupItem>
                        <Button onClick={this.handleAddToCart} disabled={true} id="urg"
                                bsStyle="danger">Order</Button>
                    </ListGroup>
                </Panel>
            )
        }
    }

    handleAddToCart(event) {
        const priceInfo = this.props.priceData;
        const selectedDoc = JSON.parse(localStorage.selectedDocs);
        let btnId = event.target.id;
        let existCart = [];
        let totalOfCart = this.state.currentCart.totalPrice;
        let item = {};
        let basicPrice = priceInfo[btnId];
        if (window.localStorage && localStorage.cart) {
            existCart = JSON.parse(localStorage.cart).items;
        } else {
            existCart = [];
        }
        switch (btnId) {
            case 'std':
                item.speed = "regular";
                item.date = moment().businessAdd(4 + this.state.nextday).format("ddd MMM Do");
                break;
            case 'exp':
                item.speed = 'express';
                item.date = moment().businessAdd(2 + this.state.nextday).format("ddd MMM Do");
                break;
            case 'urg':
                item.speed = 'urgent';
                item.date = moment().businessAdd(1 + this.state.nextday).format("ddd MMM Do");
                break;
            default:
                null;
                break;
        }
        if (this.checkSpeed(item.speed, existCart,event)) {
            item.timestamp=moment().businessAdd(this.state.nextday).format("ddd MMM Do");
            item.doc = selectedDoc.document;
            item.quantity = selectedDoc.quantity;
            item.sourceLanguage = selectedDoc.sourceLanguage;
            item.targetLanguage = selectedDoc.targetLanguage;
            item.extraCop = 0;
            item.comment = selectedDoc.comment;
            item.unitPrice = basicPrice;
            item.subTotal = basicPrice * item.quantity + 11 * item.extraCop; //Assume we charge $11 for each extra hard copy.
            existCart.push(item);
            existCart = this.addIndex(existCart);
            totalOfCart = this.calculateTotal(existCart);
            this.setState({
                currentCart: {
                    items: existCart,
                    totalPrice: totalOfCart,
                    postageType:this.state.currentCart.postageType
                },
                buttonDisable: true,
            },() => {
                localStorage.updateCopyID = JSON.stringify(item.id);
                localStorage.cart = JSON.stringify(this.state.currentCart);
                PubSub.publish("updateCart", "remove");
                console.log("updatecart")
                hashHistory.push("/needExtraCopy");
            })

            event.stopPropagation();
        } else {
            return;
        }
    }

    componentDidMount() {
        if (localStorage.cart) {
            let storedCart = JSON.parse(localStorage.cart);
            if (storedCart.items.length) {
                this.setState({currentCart: storedCart});
            }
        }
    }

    componentWillUnmount() {
        this.state.buttonDisable ? false : null;
    }

    render() {
        let stdDate = moment().businessAdd(4 + this.state.nextday).format("ddd MMM Do");
        let expDate = moment().businessAdd(2 + this.state.nextday).format("ddd MMM Do");
        let StyleObj = {
            tab: {margin: '2px'},
        };

        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <Panel header="Relaxed" bsStyle="success" style={StyleObj.tab}>
                            <ListGroup fill>
                                <ListGroupItem><strong>${this.props.priceData.std * this.state.selectedDoc.quantity}
                                    ({this.props.priceData.std}Each)</strong></ListGroupItem>
                                <ListGroupItem>Email Delivery Date<br/>{stdDate} 5pm<br/>(4 Business
                                    days)<br/></ListGroupItem>
                                <Button onClick={this.handleAddToCart} disabled={this.state.buttonDisable} id="std"
                                        bsStyle="success">Order</Button>
                            </ListGroup>
                        </Panel>
                    </div>
                    <div className="col-md-4">
                        <Panel header="Fast" bsStyle="warning" style={StyleObj.tab}>
                            <ListGroup fill>
                                <ListGroupItem><strong>${this.props.priceData.exp * this.state.selectedDoc.quantity}
                                    ({this.props.priceData.exp}Each)</strong></ListGroupItem>
                                <ListGroupItem>Email Delivery Date<br/>{expDate} 5pm<br/>(2 Business
                                    days)<br/></ListGroupItem>
                                <Button onClick={this.handleAddToCart} disabled={this.state.buttonDisable} id="exp"
                                        bsStyle="warning">Order</Button>
                            </ListGroup>
                        </Panel>
                    </div>
                    <div className="col-md-4">
                        {this.renderUrgent()}
                    </div>
                </div>
                <div className="row divborder">
                    <p><b>Each Option includes:</b></p>
                    <p><Glyphicon glyph="ok"/>A NATTI Certified Translation</p>
                    <p><Glyphicon glyph="ok"/>1 hard copy posted to your Australian Address</p>
                    <p>for <b>{this.state.selectedDoc.quantity}</b> {this.state.selectedDoc.document} Translation from {this.state.selectedDoc.sourceLanguage}
                        to {this.state.selectedDoc.targetLanguage}</p>
                </div>
                <div className="row divborder">
                    <p><Glyphicon glyph="ok"/>You will have the option to choose your postage delivery method <b>at
                        checkout.</b></p>

                </div>
                <div className="row divborder">
                    <p><Glyphicon glyph="ok"/>You will need to provice scans or photos of your documents <b>after you
                        make payment.</b></p>

                </div>
                <div>
                    {this.state.speedalert ? <SpeedAlert show={true} close={this.closeAlert.bind(this)}/> : null}
                </div>
            </div>
        )
    }
}


export default PriceList;