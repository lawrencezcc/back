import React from 'react';
import axios from 'axios';
import {Glyphicon} from 'react-bootstrap';
import {hashHistory} from 'react-router';
import Loading from 'react-loading';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import QuoteAlert from './alerts/quoteAlert'
import * as consts from '../constants';
import PubSub from 'pubsub-js';

class IndexComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            documents: null,
            languages: null,
            selectedVal: {
                comment: '',
                quantity: 1,
                document: '',
                sourceLanguage: '',
                targetLanguage: ''
            },
            alert: false,
        };
        this.handleRedir = this.handleRedir.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSrcLanguage = this.handleSrcLanguage.bind(this);
        this.handleTarLanguage = this.handleTarLanguage.bind(this);
    };

    componentWillMount() {
        let _self = this;
        let config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        axios.all([
            axios.get(consts.API_URL + '/allDocs', config),
            axios.get(consts.API_URL + '/allLanguages', config)
        ]).then(axios.spread(function (docResponse, lanResponse) {
            _self.setState({
                documents: docResponse.data,
                languages: lanResponse.data
            })
        }));
    }


    componentDidMount(){
        PubSub.publishSync("steps", 0);
    }

    handleChange(event) {
        let selectId = event.target.id;
        let selectValue = event.target.value;
        let cached = this.state.selectedVal;
        let displayState = {
            srcEnglishOnly: this.state.srcEnglishOnly,
            tarEnglishOnly: this.state.tarEnglishOnly
        }

        if (selectValue === 'selected') {
            return;
        }
        if (selectId === 'source-language' && selectValue != 'English' && !displayState.tarEnglishOnly) {
            displayState.tarEnglishOnly = true;
        } else if (selectId === 'source-language' && selectValue === 'English' && displayState.tarEnglishOnly) {
            displayState.tarEnglishOnly = false;
        }
        if (selectId === 'target-language' && selectValue != 'English' && !displayState.srcEnglishOnly) {
            displayState.srcEnglishOnly = true;
        } else if (selectId === 'target-language' && selectValue === 'English' && displayState.srcEnglishOnly) {
            displayState.srcEnglishOnly = false;
        }
        switch (selectId) {
            case 'document':
                cached.document = selectValue;
                if (selectValue === 'Family Register') {
                    cached.sourceLanguage = 'selected';
                    cached.targetLanguage = 'selected'
                }
                break;
            case 'source-language':
                if (selectValue === cached.targetLanguage) {
                    alert("cannot select same language as source and target language!!");
                    this.setState({
                        selectedVal: {
                            document: cached.document,
                            sourceLanguage: 'selected',
                            targetLanguage: cached.targetLanguage
                        }
                    });
                    return;
                }
                cached.sourceLanguage = selectValue;
                cached.targetLanguage = 'English';
                console.log("src= %s", selectValue)
                break;
            case 'target-language':
                if (selectValue === cached.sourceLanguage) {
                    alert("cannot select same language as source and target language!!");
                    this.setState({
                        selectedVal: {
                            document: cached.document,
                            sourceLanguage: cached.sourceLanguage,
                            targetLanguage: 'selected'
                        }
                    });
                    return;
                }
                cached.targetLanguage = selectValue;
                cached.sourceLanguage = 'English';
                console.log("tar= %s", selectValue)
                break;
            default :
                null;
                break;
        }
        cached.comment = '';
        this.setState({
            selectedVal: cached,
            srcEnglishOnly: displayState.srcEnglishOnly,
            tarEnglishOnly: displayState.tarEnglishOnly
        });
    }

    handleSrcLanguage(newValue) {
        let selectValue = newValue.value;
        let cached = this.state.selectedVal;
        if (selectValue !== 'English') {
            cached.sourceLanguage = selectValue;
            cached.targetLanguage = 'English';
        } else {
            cached.sourceLanguage = selectValue;
            cached.targetLanguage = '';
        }
        if (selectValue === cached.targetLanguage) {
            alert("cannot select same language as source and target language!!");
            this.setState({
                selectedVal: {
                    document: cached.document,
                    sourceLanguage: '',
                    targetLanguage: cached.targetLanguage
                }
            });
            return;
        }
        console.log("src= %s", selectValue)
        this.setState({
            selectedVal: cached,
        });
    }

    handleTarLanguage(newValue) {
        let selectValue = newValue.value;
        let cached = this.state.selectedVal;

        if (selectValue !== 'English') {
            cached.targetLanguage = selectValue;
            cached.sourceLanguage = 'English';
        } else {
            cached.targetLanguage = selectValue;
            cached.sourceLanguage = '';
        }

        if (selectValue === cached.sourceLanguage) {
            alert("cannot select same language as source and target language!!");
            this.setState({
                selectedVal: {
                    document: cached.document,
                    targetLanguage: '',
                    sourceLanguage: cached.sourceLanguage
                }
            });
            return;
        }
        console.log("tar= %s", selectValue)
        this.setState({
            selectedVal: cached,
        });
        console.log(this.state.selectedVal);
    }

    handleRedir(event) {
        let path = '';
        let selected = this.state.selectedVal;
        console.log(this.state.selectedVal);
        if (selected.sourceLanguage === 'English') {
            path = '/services/Apostille Check';
        } else if (selected.document === 'Driver\'s Licence') {
            path = '/services/Driver\'s Licence Check';

        } else if (selected.document === 'Marriage Certificate' && selected.targetLanguage === 'English') {
            path = '/services/Marriage Certificate Check';
        }
        else {
            path = '/services/quantity';
        }

        if (selected.doc === '' || selected.sourceLanguage === '' || selected.targetLanguage === '') {
            this.setState({alert: true});
            return;
        }

        if (window.localStorage) {
            localStorage.selectedDocs = JSON.stringify(selected);
        } else {
            alert('Your browser does not support localStorage');
            return;
        }
        hashHistory.push(path);
        event.stopPropagation();

    }

    docOption() {
        return (
            this.state.documents.map((doc, index) => {
                return (
                    <option value={doc.docName} key={index}>{doc.docName}</option>
                );
            })
        );
    }

    languageOption() {
        let lanArray = [];
        this.state.languages.map((lan, index) => {
            lanArray.push({value: lan.language, label: lan.language});
        })
        return lanArray;
    }

    srcLanguageSelect(document) {
        if (document === 'Family Register') {
            let fr = [
                {value: "Japanese", label: "Japanese"},
                {value: "English", label: "English"}
            ];
            return (
                <div className="form-group">
                    <Select name="source-language" id="source-language" placeholder="from what language?"
                            onChange={this.handleSrcLanguage} value={this.state.selectedVal.sourceLanguage}
                            options={fr} clearable={true} searchable={true} className={this.state.alert?"selecterror":""}/>
                </div>
            );
        } else {
            return (
                <div>
                    <Select name="source-language" id="source-language" placeholder="from what language?"
                            onChange={this.handleSrcLanguage} value={this.state.selectedVal.sourceLanguage}
                            options={this.languageOption()} clearable={true} searchable={true} className={this.state.alert?"selecterror":""}/>
                </div>
            )
        }

    }// source

    tarLanguageSelect(document) {
        if (document === 'Family Register') {
            let fr = [
                {value: "Japanese", label: "Japanese"},
                {value: "English", label: "English"}
            ];
            return (
                <div className="form-group">
                    <Select name="target-language" id="target-language" placeholder="into what language?"
                            onChange={this.handleTarLanguage} value={this.state.selectedVal.targetLanguage
                            } className={this.state.alert?"selecterror":""}
                            options={fr} clearable={true} searchable={true}/>
                </div>
            );
        } else {
            return (
                <div>
                    <Select name="target-language" id="target-language" placeholder="into what language?"
                            onChange={this.handleTarLanguage} value={this.state.selectedVal.targetLanguage}
                            options={this.languageOption()} clearable={true} searchable={true} className={this.state.alert?"selecterror":""}/>
                </div>
            )
        }

    }

    render() {
        if (!this.state.languages) {
            return (
                <div className="loading">
                    <Loading type='spin' color='#e3e3e3' height={150} width={150}/>
                </div>
            );
        }
        return (
            <div>
                <div className="form-inline form-group">
                    <select name="document" id="document" className="form-control input-lg" onChange={this.handleChange}
                            defaultValue={this.state.selectedVal.document}>
                        <option value="selected">What document would you like us to translate?</option>
                        {this.docOption()}
                    </select>
                </div>
                <div className="form-group">
                    {this.srcLanguageSelect(this.state.selectedVal.document)}
                </div>
                <div className="form-group">
                    {this.tarLanguageSelect(this.state.selectedVal.document)}
                </div>
                <div className="row col-md-6 col-md-offset-3">
                    {this.state.alert ? <QuoteAlert/> : null}
                </div>
                <div>
                    <button className="btn btn-warning form-control" onClick={this.handleRedir}>Quote Now</button>
                </div>
                <div><p><Glyphicon glyph="question-sign"/>Need to translate multiple documents?</p></div>
            </div>

        )
    }
}


export default IndexComponent;