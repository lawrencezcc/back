import SweetAlert from 'sweetalert-react';
import React from 'react';
import {hashHistory} from 'react-router';
import 'sweetalert/dist/sweetalert.css';

class HardcopyAlert extends React.Component {

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
                    title="Your order has been added"
                    html={true}
                    text="Your order includes 1 hard copy.<br/><b>Would you like to order and extra hard copy for $11?</b>"
                    type="success"
                    showCancelButton={true}
                    confirmButtonText="Yes, I want extra hard copies"
                    cancelButtonText="No extra copies"
                    onConfirm={() => {
                        console.log('add more');
                        this.setState({show: false});
                        hashHistory.push('/extraCopy');
                    }}

                    onCancel={() => {
                        this.setState({show:false});
                        hashHistory.push('/cart');
                    }}
                />
            </div>
        )
    }
}

export default HardcopyAlert;
