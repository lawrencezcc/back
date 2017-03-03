import SweetAlert from 'sweetalert-react';
import React from 'react';
import {hashHistory} from 'react-router';
import 'sweetalert/dist/sweetalert.css';
import PubSub from 'pubsub-js';

class PaySuccess extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
        };
    }

    render() {
        return (
            <div>
                <SweetAlert
                    show={this.state.show}
                    title="Thank You"
                    text="Your receipt has sent.Please upload your documents"
                    type="success"
                    onConfirm={() => {
                        PubSub.publish("upload", "change to upload");
                        this.setState({show: false});
                        hashHistory.push("/");
                    }}
                    onEscapeKey={() => {
                        PubSub.publish("upload", "change to upload");
                        this.setState({show: false});
                        hashHistory.push("/");
                    }}
                    onOutsideClick={() => {
                        PubSub.publish("upload", "change to upload");
                        this.setState({show: false});
                        hashHistory.push("/");
                    }}
                />
            </div>
        )
    }
}

export default PaySuccess;
