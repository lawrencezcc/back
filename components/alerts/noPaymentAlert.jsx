import SweetAlert from 'sweetalert-react';
import React from 'react';
import {hashHistory} from 'react-router';
import 'sweetalert/dist/sweetalert.css';

class NoPayAlert extends React.Component {

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
                    title="No Pay"
                    text="Go back to checkout"
                    type="warning"
                    onConfirm={() => {
                        console.log('back');
                        this.setState({show: false});
                        hashHistory.push('/cart');
                    }}
                    onEscapeKey={() => {
                        this.setState({show: false});
                        hashHistory.push('/cart');
                    }}
                    onOutsideClick={() => {
                        this.setState({show: false});
                        hashHistory.push('/cart');
                    }}
                />
            </div>
        )
    }
}

export default NoPayAlert;
