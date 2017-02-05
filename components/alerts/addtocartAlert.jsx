import SweetAlert from 'sweetalert-react';
import React from 'react';
import {hashHistory} from 'react-router';
import 'sweetalert/dist/sweetalert.css';

class AddtoCart extends React.Component {

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
                    title="Your extra hard copies have been added"
                    text="Do you need any more documents translated"
                    type="success"
                    showCancelButton={true}
                    confirmButtonText="Checkout"
                    cancelButtonText="Yes,add more documents"
                    onConfirm={() => {
                        console.log('confirm');
                        this.setState({show: false});
                        hashHistory.push('/cart');
                    }}

                    onCancel={() => {
                        console.log('add more');
                        this.setState({show: false});
                        hashHistory.push('/services');
                    }}

                />
            </div>
        )
    }
}

export default AddtoCart;
