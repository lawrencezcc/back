import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory,IndexRedirect,Redirect} from 'react-router';
import Layout from './components/common.comp';
import ContactComponent from './components/contact.comp.jsx';
import ServiceComponent from './components/service.comp.jsx';
import GetPrice from './components/getPrice';
import DLComponent from './components/driveLicence.comp';
import DocUpload from './components/upload.comp';
import MCComponent from './components/marriagecertificate.comp';
import APComponent from './components/apostille.comp';
import Cart from './components/cart.comp';
import Quantity from './components/quantity';
import ExtraCopyComponent from './components/extraCopy';
import NeedExtraCopyComponent from './components/needExtraCopy.comp';
import IndexComponent from './components/index.comp';
import AddMoreDocComponent from './components/addMoreDoc.comp';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <IndexRedirect to="/services" />
            <Route path="/services" component={ServiceComponent}>
                <IndexRoute component={IndexComponent}/>
                <Route path="/services/Driver's Licence Check" component={DLComponent}/>
                <Route path="/services/Apostille Check" component={APComponent}/>
                <Route path="/services/Marriage Certificate Check" component={MCComponent}/>
                <Route path="/services/quantity" component={Quantity}/>
            </Route>

            <Route path="/services/:doc" component={GetPrice}/>
            <Route path="/cart" component={Cart}/>
            <Route path="/extraCopy" component={ExtraCopyComponent}/>
            <Route path="/needExtraCopy" component={NeedExtraCopyComponent}/>
            <Route path="/addMoreDoc" component={AddMoreDocComponent}/>
            <Route path="/contact" component={ContactComponent}/>
            <Route path="/upload" component={DocUpload}/>
        </Route>
    </Router>,
document.getElementById('app')
);