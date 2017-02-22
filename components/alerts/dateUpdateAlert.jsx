import SweetAlert from 'sweetalert-react';
import React from 'react';
import {hashHistory} from 'react-router';
import 'sweetalert/dist/sweetalert.css';
import PubSub from 'pubsub-js';

class dateUpdateAlert extends React.Component {

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
                    title="Important"
                    text='It looks like you started your order a while ago. Your estimated delivery dates have been updated.
                      Please check them in the cart and then click "check" again.' //todo change words
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

export default dateUpdateAlert;
