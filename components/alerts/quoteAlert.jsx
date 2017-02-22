import {Alert} from 'react-bootstrap';

import React from 'react';

class QuoteAlert extends React.Component{

    render() {
        return(
            <Alert bsStyle="info">
                <strong>Please</strong> finish all information
            </Alert>
        )
    }
}

export default QuoteAlert;
