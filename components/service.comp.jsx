import React from 'react';

class ServiceComponent extends React.Component {
    constructor() {
        super();
    };

    render() {
        return (
            <div>
                <div className="jumbotron row">
                    <h1>Order your NATTI Certified Translation Online!</h1>
                    <div className="form-group divborder col-sm-8 ">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default ServiceComponent;