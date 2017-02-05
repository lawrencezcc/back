import React from 'react';
import {Button} from 'react-bootstrap';
import PubSub from 'pubsub-js';
import AddtoCart from './alerts/addtocartAlert';

class ExtraCopyComponent extends React.Component{ //TODO 啥都没改呢

    constructor() {
        super();
        this.state = {
            currentCart: {
                items : JSON.parse(localStorage.cart).items,
                totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice)
            },
            showalert: false
        }
        this.updateCopy=this.updateCopy.bind(this);
        this.handleRedir = this.handleRedir.bind(this);
    }

    updateCopy(items,number,id){
        for (var i in items){
            if (items[i].id==id){
                items[i].extraCop = number;
                items[i].subTotal += number*11*items[i].quantity;
            }
        }
        console.log(items);
        return items
    }

    calculateTotal(items) {
        let sum = 0;
        items.map((item) => {
            sum += item.subTotal;
        });
        return sum;
    }

    handleRedir(button){
        let items = JSON.parse(localStorage.cart).items;
        const id = JSON.parse(localStorage.updateCopyID);
        const quantity=parseInt(button.target.id)
        let newitems = this.updateCopy(items,quantity,id)
        let totalOfCart = this.calculateTotal(newitems);
        localStorage.removeItem("updateCopyID");
        this.setState({
            currentCart: {
                items: newitems,
                totalPrice: totalOfCart
            },
            showalert: true
        },
            function () {
                localStorage.cart = JSON.stringify(this.state.currentCart);
                PubSub.publish("updateCart", "update");
                console.log("publish");
        });
    }

    render(){
        const buttonNumber=[{id:1},{id:2},{id:3},{id:4},{id:5}]
        const buttons=buttonNumber.map((button) => {
            return(
                <Button bsStyle="success" onClick={this.handleRedir}
                        id={button.id} key={button.id}>{button.id}</Button>
            )
        })

        return(
            <div>
                <div className="jumbotron row">
                    <h1>Order your NATTI Certified Translation Online!</h1>
                    <div className="form-group divborder col-sm-8 ">
                        <div className="form-group" >
                           <p>How many extra hard copies would you like to order?</p>
                        </div>
                        <div className="form-inline btn-group">
                            {buttons}
                        </div>
                    </div>
                </div>
                <div>
                    {this.state.showalert ? <AddtoCart show={true}/> : null}
                </div>
            </div>
        )
    }
}


export default ExtraCopyComponent;