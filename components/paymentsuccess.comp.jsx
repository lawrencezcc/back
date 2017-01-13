import SweetAlert from 'sweetalert-react';
import React from 'react';
import {hashHistory} from 'react-router';
import 'sweetalert/dist/sweetalert.css';

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
                        console.log('confirm');
                        this.setState({show: false});
                        hashHistory.push('/upload');
                    }}
                    onEscapeKey={() => {
                        this.setState({show: false});
                        hashHistory.push('/upload');
                    }}
                    onOutsideClick={() => {
                        this.setState({show: false});
                        hashHistory.push('/upload');
                    }}
                />
            </div>
        )
    }
}

export default PaySuccess;
