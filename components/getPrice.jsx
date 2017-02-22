import React from 'react';
import axios from 'axios';
import PriceList from './priceList.comp';
import Loading from 'react-loading';
import * as consts from '../constants.js';
import PubSub from 'pubsub-js';

class GetPrice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPrice: null
        }
    }

    componentWillMount() {
        let selectedProduct = JSON.parse(localStorage.selectedDocs);
        let _self = this;
        let config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        let language = ''
        if (selectedProduct.sourceLanguage === 'English') {
            language = selectedProduct.targetLanguage;
        } else {
            language = selectedProduct.sourceLanguage;
        }
        /*
         just 1 language is enough to get the data except English
         */


        axios.get(consts.API_URL + '/getPrice?document=' + selectedProduct.document + '&language=' + language, config)
            .then(function (response) {
                _self.setState({
                    currentPrice: response.data
                });
            });
        console.log(this.state.currentPrice);
    }

    componentDidMount(){
        PubSub.publishSync("steps",1);
    }

    render() {
        if (!this.state.currentPrice) {
            return (
                <div className="loading">
                    <Loading type='spin' color='#e3e3e3' height={150} width={150}/>
                </div>
            );
        }

        return (

            <div className="jumbotron text-center">
                <h1>Choose your option</h1>
                <PriceList priceData={this.state.currentPrice}/>
            </div>
        )

    }
}

export default GetPrice;