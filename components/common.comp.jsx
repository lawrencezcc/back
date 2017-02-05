import React from 'react';
import {Glyphicon, Label} from 'react-bootstrap';
import {Link} from 'react-router';
import PubSub from 'pubsub-js';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        if (localStorage.cart) {
            this.state = {
                cart: {
                    items: JSON.parse(localStorage.cart).items,
                    totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice)
                },
            }
        } else {
            this.state = {
                cart: {
                    items: [],
                    totalPrice: 0.00
                },
            }
        }
        if (localStorage.order) {
            this.state = {
                upload: true
            }
        } else {
            this.state = {
                upload: false
            }
        }
        this.update = this.update.bind(this);
        this.cartOrUpload = this.cartOrUpload.bind(this);
    }

    componentDidMount() {

        this.updatecart = PubSub.subscribe('updateCart', function () { //published in cart and pricelist.
            if (localStorage.cart) {
                this.setState({
                    cart: {
                        items: JSON.parse(localStorage.cart).items,
                        totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice)
                    }
                })
            } else {
                this.setState({
                    cart: {
                        items: [],
                        totalPrice: 0.00
                    }
                })
            }
        }.bind(this));

        this.uploadDoc = PubSub.subscribe('upload', function () { //published in upload and paymentsuccessAlert
            if (localStorage.order) {
                this.setState({
                    upload: true
                })
            } else {
                this.setState({
                    upload: false
                })
            }
        }.bind(this));
    }

    componentWillUnmount() {
        console.log("unsubscribe");
        PubSub.unsubscribe(this.updatecart);
        PubSub.unsubscribe(this.uploadDoc);
    }

    update() {
        console.log("updated price")
        if (localStorage.cart) {
            this.setState({
                cart: {
                    items: JSON.parse(localStorage.cart).items,
                    totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice)
                },
            })
        } else {
            this.setState({
                cart: {
                    items: [],
                    totalPrice: 0.00
                }
            })
        }
    }

    cartOrUpload() {
        if (this.state.upload) {
            return (
                <Link to="/upload"><Glyphicon glyph="upload"/> Upload</Link>
            )
        } else {
            return (
                <Link to="/cart"><Glyphicon glyph="shopping-cart"/>
                    Cart{this.state.cart ?  "$" + this.state.cart.totalPrice + "(" + this.state.cart.items.length + ")":" Empty"  }
                </Link>
            )
        }
    }

    render() {

        return (
            <div>
                <nav className="navbar navbar-default navbar-transparent">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                    data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <Link className="navbar-brand brand-name " to="/">Ethnolink</Link>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav menu">
                                <li>
                                    {this.cartOrUpload()}
                                </li>
                                <li>
                                    <Link to="/contact"><Glyphicon glyph="envelope"/> Contact</Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </nav>
                <div className="container">
                    {this.props.children}
                </div>
            </div>

        );
    }


}

export default Layout;