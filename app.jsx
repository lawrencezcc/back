import React from 'react';
import ReactDOM from 'react-dom';
import { Router,Route,IndexRoute,hashHistory } from 'react-router';
import Layout from './components/common.comp';
import ContactComponent from './components/contact.comp.jsx';
import ServiceComponent from './components/service.comp.jsx';
import GetPrice from './components/product.comp';
import DLComponent from './components/driveLicence.comp';
import DocUpload from './components/upload.comp';
import MCComponent from './components/marriagecertificate.comp';
import APComponent from './components/apostille.comp';
import Cart from './components/cart.comp';
import Quality from './components/quantity';
import ExtraCopyComponent from './components/extraCopy';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Layout} >
            <IndexRoute component={ServiceComponent}/>
            <Route path="/services" components={ServiceComponent}>
                <Route path="/services/Driver's Licence Check" component={DLComponent}/>
                <Route path="/services/Apostille Check" component={APComponent}/>
                <Route path="/services/Marriage Certificate Check" component={MCComponent}/>
            </Route>
            <Route path="/services/quality" component={Quality}/>
            <Route path="/services/:doc" component={GetPrice} />
            <Route path="/cart" component={Cart}/>
            <Route path="/extraCopy" component={ExtraCopyComponent}/>
            <Route path="/contact" component={ContactComponent}/>
            <Route path="/upload" component={DocUpload}/>
        </Route>
    </Router>,
    document.getElementById('app')
);