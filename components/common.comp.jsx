import React from 'react';
import {Glyphicon, Label} from 'react-bootstrap';
import {Link} from 'react-router';
import PubSub from 'pubsub-js';
import Steps from "rc-steps";
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css'

class Layout extends React.Component {
    constructor(props) {
        super(props);
        if (localStorage.cart) {
            this.state = {
                cart: {
                    items: JSON.parse(localStorage.cart).items,
                    totalPrice: parseInt(JSON.parse(localStorage.cart).totalPrice)
                },
                step: 0,
            }
        } else {
            this.state = {
                cart: {
                    items: [],
                    totalPrice: 0.00
                },
                step: 0,
            }
        }
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

        this.updateSteps = PubSub.subscribe('steps', function (msg, data) { //published in upload and paymentsuccessAlert
            this.setState({step: data})
        }.bind(this));
    }

    componentWillUnmount() {
        console.log("unsubscribe");
        PubSub.unsubscribe(this.updatecart);
        PubSub.unsubscribe(this.updateSteps);
    }

    render() {
        const steps = [{
            title: 'Document',
        }, {
            title: 'Options',
        }, {
            title: 'Upload Documents',
        }].map((s, i) => {
            return (
                <Steps.Step
                    key={i}
                    status={s.status}
                    title={s.title}
                />
            );
        });
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
                            <Link className="navbar-brand brand-name " to="/services">Ethnolink</Link>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav menu">
                                <li>
                                    <Link to="/cart"><Glyphicon glyph="shopping-cart"/>
                                        Cart{this.state.cart ? "$" + this.state.cart.totalPrice + "(" + this.state.cart.items.length + ")" : " Empty"  }
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact"><Glyphicon glyph="envelope"/> Contact</Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </nav>
                <div className="container">
                    <Steps current={this.state.step}>{steps}</Steps>
                </div>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }


}

export default Layout;