import React from 'react';
import ReactDOM from 'react-dom';
import { Router,Route,IndexRoute,hashHistory } from 'react-router';
import Layout from './components/common.comp';
import HomeComponent from './components/home.comp';
import ClientComponent from './components/client.comp.jsx';
import ContactComponent from './components/contact.comp.jsx';
import ServiceComponent from './components/service.comp.jsx';
import GetPrice from './components/product.comp';
import DLComponent from './components/driveLicence.comp';
import DocUpload from './components/upload.comp';
import MCComponent from './components/marriagecertificate.comp';
import APComponent from './components/apostille.comp';
import Stripe from './components/stripe';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Layout} >
            <IndexRoute component={HomeComponent}/>
            <Route path="/services" components={ServiceComponent}>
                <Route path="/services/Driver's Licence Check" component={DLComponent}/>
                <Route path="/services/Apostille" component={APComponent}/>
                <Route path="/services/Marriage Certificate Check" component={MCComponent}/>
            </Route>
            <Route path="/services/:doc" component={GetPrice} >
            </Route>
            <Route path="/client" component={ClientComponent}/>
            <Route path="/contact" component={ContactComponent}/>
            <Route path="/upload" component={DocUpload}/>
        </Route>
    </Router>,
    document.getElementById('app')
);