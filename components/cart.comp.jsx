import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory} from 'react-router';
import {Button, Table, InputGroup} from 'react-bootstrap';
import moment from 'moment-business-days';
import momentTimeZone from 'moment-timezone';
import PubSub from 'pubsub-js';
import DateUpdateAlert from './alerts/dateUpdateAlert';


class Cart extends React.Component {

    constructor(props) {
        super(props);
        if (localStorage.cart) {
            this.state = {
                cart: {
                    items: JSON.parse(localStorage.cart).items,
                    totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice),
                    postageType: JSON.parse(localStorage.cart).postageType,
                    hardCopyDate: JSON.parse(localStorage.cart).hardCopyDate,
                },
                postage: {
                    postage: false,
                    postageType: "Regular Post",
                    quantity: this.numberOfLan(JSON.parse(localStorage.cart)),
                    postageUnit: 0,

                },
                form: {},
                dateUpdate: false
            }
        } else {
            this.state = {
                cart: {
                    items: [],
                    totalPrice: 0
                },
                postage: {
                    postage: false,
                    postageType: "Regular Post",
                    quantity: 1,
                    postageUnit: 0,

                },
                form: {},
                dateUpdate: false
            }
        }
        this.addMoreDoc = this.addMoreDoc.bind(this);
        this.postage = this.postage.bind(this);
        this.removePostage = this.removePostage.bind(this);
        this.dateUpdate = this.dateUpdate.bind(this);
        this.postEstimation = this.postEstimation.bind(this);
        this.remove = this.remove.bind(this);
    }


    dateUpdate() {
        let cart = this.state.cart;
        let update = false;
        const nextday = momentTimeZone().tz("Australia/Sydney").hour() >= 17 ? 1 : 0;
        for (var i in cart.items) {
            if (moment().businessAdd(nextday).format("ddd MMM Do") !== cart.items[i].timestamp) {
                console.log(cart.items[i].timestamp);
                let newdate = '';
                switch (cart.items[i].speed) {
                    case 'regular':
                        newdate = moment().businessAdd(4 + nextday).format("ddd MMM Do");
                        break;
                    case 'express':
                        newdate = moment().businessAdd(2 + nextday).format("ddd MMM Do");
                        break;
                    case 'urgent':
                        newdate = moment().businessAdd(1 + nextday).format("ddd MMM Do");
                        break;
                    default:
                        null;
                        break;
                }
                update = true;
                cart.items[i].date = newdate;
                cart.items[i].timestamp = moment().businessAdd(nextday).format("ddd MMM Do");
            }
        }
        if (update) {
            this.setState({
                dateUpdate: true,
                cart: cart,
            }, () => {
                localStorage.cart = JSON.stringify(this.state.cart);
            })
        }
        return update;
    }


    closeAlert() {
        this.setState({
            dateUpdate: false
        });
    }

    componentDidMount() {
        if (this.state.cart.postageType) {
            this.postageCalc(this.state.cart.postageType)
        }
        PubSub.publishSync("steps", 2);
        this.dateUpdate();
    }

    addMoreDoc(event) {
        event.stopPropagation();
        hashHistory.push('/services');
    }

    numberOfLan(cart) {
        let lanSet = new Set();
        for (var i in cart.items) {
            lanSet.add(cart.items[i].sourceLanguage);
            lanSet.add(cart.items[i].targetLanguage);
        }
        const number = lanSet.size - 1
        if (number > 0) {
            return number;
        } else {
            return 0;
        }
        // Calculate the number of language involved except English
    }

    removePostage() {
        this.setState({
            postage: {
                postage: false,
                postageType: "Regular Post",
                quantity: 1,
                postageUnit: 0,
            },
            cart: {
                items: this.state.cart.items,
                totalPrice: this.calculateTotal(this.state.cart.items)
            }
        }, () => {
            localStorage.cart = JSON.stringify(this.state.cart);

        })
        this.forceUpdate();
    }

    postageCalc(postageID) {
        let postageUnit = 0;
        if (postageID === "Express Post") {
            postageUnit = 16; //Express Unit
        }
        let newPostage = {}
        const cart = this.state.cart;
        newPostage.postage = true;
        newPostage.postageType = postageID;
        newPostage.quantity = this.numberOfLan(this.state.cart);
        newPostage.postageUnit = postageUnit;
        let totalOfCart = this.calculateTotal(cart.items) + newPostage.quantity * newPostage.postageUnit;
        this.setState({
            cart: {
                items: cart.items,
                totalPrice: totalOfCart,
                postageType: postageID,
                hardCopyDate: this.postDateCalc(postageID),
            },
            postage: newPostage
        }, () => {
            localStorage.cart = JSON.stringify(this.state.cart);

        })
        this.forceUpdate();
    }

    postage(event) {
        if (this.state.postage.postage) {
            this.removePostage();
        }
        let postageID = event.target.id;
        this.postageCalc(postageID);

    }

    edit(item, event) {
        const args = event.target.id.split(':');
        const elementId = args[0];
        const action = args[1];
        let postage = this.state.postage;
        let updatedCart = this.state.cart;
        let QtyInput = ReactDOM.findDOMNode(this.refs[elementId + ':qty']);
        let copyQty = parseInt(QtyInput.value);
        if (action === 'add') {
            QtyInput.value = copyQty + 1;
            this.updateItem(updatedCart.items, 'subTotal', item, '+=', 11 * item.quantity);
            this.updateItem(updatedCart.items, 'extraCop', item, '+=', 1);
            updatedCart.totalPrice = this.calculateTotal(updatedCart.items) + postage.quantity * postage.postageUnit;
        } else if (action === 'subs') {
            if (copyQty <= 0) {
                return;
            }
            QtyInput.value = copyQty - 1;
            this.updateItem(updatedCart.items, 'subTotal', item, '-=', 11 * item.quantity);
            this.updateItem(updatedCart.items, 'extraCop', item, '-=', 1)
            updatedCart.totalPrice = this.calculateTotal(updatedCart.items) + postage.quantity * postage.postageUnit;
        }
        this.setState((prevState, props) => {
            return {
                cart: updatedCart
            };
        });
        localStorage.cart = JSON.stringify(this.state.cart);

    }

    remove(item) {
        let newState = this.state.cart;
        let newPostage = this.state.postage;
        const deletedItemPrice = item.subTotal;
        if (newState.items.indexOf(item) > -1) {
            newState.items.splice(newState.items.indexOf(item), 1);
            newPostage.quantity = this.numberOfLan(newState);
            newState.totalPrice = this.calculateTotal(newState.items) + newPostage.quantity * newPostage.postageUnit;
            this.setState((prevState, props) => {
                return {
                    cart: newState,
                    postage: newPostage,
                };
            });
            localStorage.cart = JSON.stringify(newState);
            let token = PubSub.publishSync("updateCart", "remove");
            this.forceUpdate();
            console.log(token);
        }

    }

    calculateTotal(items) {
        let sum = 0;
        items.map((item) => {
            sum += item.subTotal;
        });
        return sum;
    }


    updateItem(cart, attr, item, opt, val) {
        cart.map((carItem) => {
            if (carItem.id === item.id) {
                if (opt === '+=') {
                    item[attr] += val;
                } else if (opt === '-=') {
                    item[attr] -= val;
                }
            }
        });
    }


    postDateCalc(type) {
        const nextday = momentTimeZone().tz("Australia/Sydney").hour() >= 17 ? 1 : 0;
        let softCopyDate = '';
        let hardCopyDate = '';
        if (!this.state.cart.items.length) {
            return (<div></div>)
        } else {
            switch (this.state.cart.items[0].speed) {
                case 'regular':
                    softCopyDate = moment().businessAdd(4 + nextday)
                    break;
                case 'express':
                    softCopyDate = moment().businessAdd(2 + nextday)
                    break;
                case 'urgent':
                    softCopyDate = moment().businessAdd(1 + nextday)
                    break;
                default:
                    null;
                    break;
            }
            switch (type) {
                case 'Regular Post':
                    hardCopyDate = softCopyDate.businessAdd(7).format("ddd MMM Do");
                    return hardCopyDate;
                case 'Express Post':
                    hardCopyDate = softCopyDate.businessAdd(2).format("ddd MMM Do");
                    return hardCopyDate;
                default:
                    return;
            }
        }
    }

    postEstimation(type) {
        switch (type) {
            case 'Regular Post':
                return (<div style={{display: "inline-block", float: "left"}}>Regular Post time: {this.postDateCalc("Regular Post")}</div>)
            case 'Express Post':
                return (<div style={{display: "inline-block", float: "right"}}>Express Post time: {this.postDateCalc("Express Post")}</div>)
            default:
                return (<div></div>)
        }
    }


    renderPostage() {
        if (this.state.postage.postage === true) {
            return (
                <tr>
                    <td>{this.state.postage.postageType}</td>
                    <td>{this.state.postage.quantity}</td>
                    <td>${this.state.postage.postageUnit}</td>
                    <td colSpan="5">
                    </td>
                    <td>
                        ${this.state.postage.quantity * this.state.postage.postageUnit}</td>
                    <td><Button bsStyle="danger" onClick={this.removePostage.bind(this)}
                                id="removePostage">remove</Button></td>
                </tr>
            )
        } else {
            return null;
        }
    }

    render() {
        const postage = this.renderPostage();
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                cart: this.state.cart,
                update: this.dateUpdate(),
            })
        );
        const cartItemRow = this.state.cart.items.map((item) => {
            return (
                <tr key={item.id} id={item.id}>
                    <td>{item.doc}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice}</td>
                    <td>{item.sourceLanguage}</td>
                    <td>{item.targetLanguage}</td>
                    <td>{item.speed}</td>
                    <td>{item.date}</td>
                    <td>
                        <InputGroup bsSize="small">
                            <InputGroup.Button>
                                <Button bsStyle="info" onClick={this.edit.bind(this, item)}
                                        id={'item-' + item.id + ':subs'}>-</Button>
                            </InputGroup.Button>
                            <input className="form-control" readOnly type="text" ref={'item-' + item.id + ':qty'}
                                   defaultValue={item.extraCop} maxLength={5}/>
                            <InputGroup.Button>
                                <Button bsStyle="info" onClick={this.edit.bind(this, item)}
                                        id={'item-' + item.id + ':add'}>+</Button>
                            </InputGroup.Button>
                        </InputGroup>
                    </td>
                    <td>${item.subTotal}</td>
                    <td><Button bsStyle="danger" onClick={this.remove.bind(this, item)}
                                id={'btn-' + item.id}>remove</Button></td>
                </tr>
            )
        });
        return (
            <div>
                <Table responsive condensed hover>
                    <thead>
                    <tr>
                        <th>Document</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Translate From</th>
                        <th>Translate Into</th>
                        <th>Speed</th>
                        <th>Email Delivery Date</th>
                        <th>Extra Copy</th>
                        <th>Sub-Total</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.cart.items.length ? cartItemRow : null}
                    {postage}
                    <tr>
                        <td colSpan="7"></td>
                        <td className="text-right">Total Price $:</td>
                        <td >{this.calculateTotal(this.state.cart.items) + this.state.postage.quantity * this.state.postage.postageUnit}</td>
                    </tr>
                    </tbody>
                </Table>
                {this.postEstimation("Regular Post")}
                {this.postEstimation("Express Post")}
                <div className="btn-group btn-group-justified form-inline">
                    <div className="btn-group">
                        <Button bsStyle="warning" onClick={this.postage} id="Regular Post">Choose Regular Post</Button>
                    </div>
                    <div className="btn-group">
                        <Button bsStyle="warning" onClick={this.postage} id="Express Post">Choose Express Post</Button>
                    </div>
                    <div className="btn-group">
                        <Button bsStyle="warning" onClick={this.postage} id="No Hard Copy">No Hard Copy
                            Required</Button>
                    </div>
                </div>

                <div>
                    {this.state.dateUpdate ? <DateUpdateAlert show={true} close={this.closeAlert.bind(this)}/> : null}
                </div>

                <div className="btn-group btn-group-justified form-inline">
                    <div className="btn-group">
                        <Button bsStyle="success" onClick={this.addMoreDoc}>Add more
                            documents</Button>
                    </div>
                </div>
                <div>
                    {childrenWithProps}
                </div>
            </div >
        );
    }
}

export default Cart;