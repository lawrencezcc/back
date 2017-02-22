import SweetAlert from 'sweetalert-react';
import React from 'react';
import {hashHistory} from 'react-router';
import 'sweetalert/dist/sweetalert.css';
import PubSub from 'pubsub-js';

class PostageAlert extends React.Component {

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
                    title="Please choose a delivery method"
                    text="You must choose a postage method before you can checkout"
                    type="warning"
                    onConfirm={() => {
                        this.setState({show: false});
                        this.props.close();
                    }}
                    onEscapeKey={() => {

                        this.setState({show: false});
                        this.props.close();

                    }}
                    onOutsideClick={() => {

                        this.setState({show: false});
                        this.props.close();

                    }}
                />
            </div>
        )
    }
}

export default PostageAlert;
