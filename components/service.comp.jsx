import React from 'react';
import axios from 'axios';
import {   hashHistory } from 'react-router';
class ServiceComponent extends React.Component{
    constructor(){
        super();
        this.state = {
            documents: [],
            languages: [],
            selectedVal: {
                comment: '',
                document: 'selected',
                sourceLanguage: 'selected',
                targetLanguage: 'selected'
            },
            srcEnglishOnly: false,
            tarEnglishOnly: false

        };
        this.handleRedir = this.handleRedir.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    componentDidMount(){
        let _self = this;
        let config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        axios.all([
            axios.get('http://localhost:5000/allDocs',config),
            axios.get('http://localhost:5000/allLanguages',config)
        ]).then(axios.spread(function(docResponse,lanResponse){
            _self.setState({
                documents: docResponse.data,
                languages: lanResponse.data
            })
        }));
    }
    handleChange(event){
        let selectId = event.target.id;
        let selectValue = event.target.value;
        let cached = this.state.selectedVal;
        let displayState = {
            srcEnglishOnly: this.state.srcEnglishOnly,
            tarEnglishOnly: this.state.tarEnglishOnly
        }

        if(selectValue === 'selected'){
            return;
        }
        if(selectId === 'source-language' && selectValue != 'English' && !displayState.tarEnglishOnly){
            displayState.tarEnglishOnly = true;
        }else if(selectId === 'source-language' && selectValue === 'English' && displayState.tarEnglishOnly){
            displayState.tarEnglishOnly =false;
        }
        if(selectId === 'target-language' && selectValue != 'English' && !displayState.srcEnglishOnly ){
            displayState.srcEnglishOnly = true;
        }else if(selectId === 'target-language' && selectValue === 'English' && displayState.srcEnglishOnly){
            displayState.srcEnglishOnly = false;
        }
        switch (selectId){
            case 'document':
                cached.document = selectValue;
                if(selectValue === 'Family Register'){
                    cached.sourceLanguage = 'selected';
                    cached.targetLanguage = 'selected'
                }
                break;
            case 'source-language':
                if(selectValue === cached.targetLanguage){
                    alert("cannot select same language as source and target language!!");
                    this.setState({
                        selectedVal:{
                            document: cached.document,
                            sourceLanguage: 'selected',
                            targetLanguage:cached.targetLanguage
                        }
                    });
                    return;
                }
                cached.sourceLanguage = selectValue;
                cached.targetLanguage = 'English';
                console.log("src= %s",selectValue)
                break;
            case 'target-language':
                if(selectValue === cached.sourceLanguage){
                    alert("cannot select same language as source and target language!!");
                    this.setState({
                        selectedVal:{
                            document: cached.document,
                            sourceLanguage: cached.sourceLanguage,
                            targetLanguage: 'selected'
                        }
                    });

                    return;
                }
                cached.targetLanguage = selectValue;
                cached.sourceLanguage = 'English';
                console.log("tar= %s",selectValue)
                break;
            default :
                null;
                break;
        }
        cached.comment='';
        this.setState({
            selectedVal: cached,
            srcEnglishOnly: displayState.srcEnglishOnly,
            tarEnglishOnly: displayState.tarEnglishOnly
        });

    }
    handleRedir(event){
        let path = '';
        let selected = this.state.selectedVal;
        console.log(this.state.selectedVal);
        if (selected.sourceLanguage === 'English'){
            path = '/services/Apostille';
        }else if(selected.document === 'Driver\'s Licence')
        {
            path = '/services/Driver\'s Licence Check';

        }else if (selected.document === 'Marriage Certificate' && selected.targetLanguage === 'English'){
            path = '/services/Marriage Certificate Check';
        }
        else{
            path = '/services/'+selected.document;
        }

        if(selected.doc === 'selected' || selected.sourceLanguage === 'selected' || selected.targetLanguage === 'selected' ){
            alert( "Please complete the information ");
            return;
        }

        if(window.localStorage){
            localStorage.selectedDocs = JSON.stringify(selected);
        }else{
            alert('Your browser does not support localStorage');
            return;
        }
        hashHistory.push(path);
        event.stopPropagation();

    }
    docOption(){
        return(
            this.state.documents.map((doc,index)=>{
                return (
                    <option value={doc.docName} key={index}>{doc.docName}</option>
                );
            })
        );
    }
    lanOption(){
        return (
            this.state.languages.map((lan,index) => {
                return(
                    <option value={lan.language} key={index}>{lan.language}</option>
                );
            })
        );
    }
    srcLanguageSelect(document){
        if(document === 'Family Register' ) {
            return (
                <div className="form-group">
                    <select name="source-language" id="source-language" className="form-control" onChange={this.handleChange} defaultValue={this.state.selectedVal.sourceLanguage} >
                        <option value="selected">Source Language </option>
                        <option value="Japanese">Japanese</option>
                        <option value="English">English</option>
                    </select>
                </div>
            );
        }else{
            return(
                <div className="form-group">
                    <select name="source-language" id="source-language" className="form-control" onChange={this.handleChange} defaultValue={this.state.srcEnglishOnly?"English":this.state.selectedVal.sourceLanguage} >
                        <option value="selected">Source Language </option>
                        {(this.state.srcEnglishOnly)?<option value="English" selected="selected">English</option>:this.lanOption()}
                    </select>
                </div>
            )
        }

    }// source
    tarLanguageSelect(document){
        if(document === 'Family Register' ) {
            return (
                <div className="form-group">
                    <select name="target-language" id="target-language" className="form-control" onChange={this.handleChange} defaultValue={this.state.selectedVal.targetLanguage} >
                        <option value="selected">Target Language </option>
                        <option value="Japanese">Japanese</option>
                        <option value="English">English</option>
                    </select>
                </div>
            );
        }else{
            return(
                <div className="form-group">
                    <select name="target-language" id="target-language" className="form-control" onChange={this.handleChange} defaultValue={this.state.tarEnglishOnly?"English":this.state.selectedVal.targetLanguage} >
                        <option value="selected">Target Language </option>
                        {(this.state.tarEnglishOnly)?<option value="English" selected="selected">English</option>:this.lanOption()}
                    </select>
                </div>
            )
        }

    }
    render(){
        return(
            <div>
                <div className=" jumbotron text-center">
                    <h1>Choose Your Service</h1>
                    <div className="form-group" style={{color:'white'}}>
                        <div className="form-inline form-group" >
                            I want to translate a
                            <select name="document" id="document" className="form-control" onChange={this.handleChange} defaultValue={this.state.selectedVal.document} >
                                <option value="selected">Select a Document</option>
                                {this.docOption()}
                            </select>
                        </div>
                        <div className="form-inline form-group"><br/>
                            from
                            {this.srcLanguageSelect(this.state.selectedVal.document)}
                        </div>
                        <div className="form-inline form-group"><br/>
                            into
                            {this.tarLanguageSelect(this.state.selectedVal.document)}
                        </div>
                        {/*<div className="form-group">*/}
                        {/*<select name="source-language" id="source-language" className="form-control" onChange={this.handleChange} defaultValue="selected" >*/}
                        {/*<option value="selected">Source Language </option>*/}
                        {/*{(this.state.srcEnglishOnly)?<option value="English">English</option>:this.lanOption(this.state.selectedVal.document)}*/}
                        {/*</select>*/}
                        {/*</div>*/}
                        {/*<div className="form-group">*/}
                        {/*<select name="target-language" id="target-language" className="form-control" onChange={this.handleChange} defaultValue="selected">*/}
                        {/*<option value="selected">Target Language</option>*/}
                        {/*{(this.state.tarEnglishOnly)?<option value="English">English</option>:this.lanOption(this.state.selectedVal.document)}*/}
                        {/*</select>*/}
                        {/*</div>*/}

                            <button className="btn btn-primary form-control"  onClick={this.handleRedir}>Quote Now</button>

                    </div>
                </div>

                <div >
                    {this.props.children}
                </div>
            </div>


        )
    }
}


export default ServiceComponent;