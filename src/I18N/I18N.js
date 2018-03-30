/*global localStorage*/
import React from 'react';

export default  class I18N extends React.Component {
    constructor(){
        super();
        this.state = {
            translated: '',
            words: '',
            defaultLang: '',
            pathToWords: '',
        };
    }
    
    getWords(){
        return new Promise(function(resolve, reject) {
            if(this.state.words !== ''){
                resolve(this.state.words);
            }else{
                var request = new XMLHttpRequest();
                request.open('GET', localStorage.getItem('pathToWordsi18n'));
                request.onreadystatechange = function() {
                    if(request.responseText !== "" && request.status == 200){
                        localStorage.setItem('wordsi18n', request.responseText);
                        this.setState({words:JSON.parse(request.responseText)});
                        resolve(JSON.parse(request.responseText));
                    }
                }.bind(this);
                request.send();    
            }
        }.bind(this));
    }
    
    getSourceText(text){
        this.dynamicText  = text;
        this.mnemonicText = text.replace(/[0-9]/g, '%$&%').replace('%%', ''); 
        this.mnemonics = [];
        var insert = false;
        var currentMnemonic = -1;
        this.mnemonicText.split('').forEach(function(char, index){
            if(char === '%'){
                insert = !insert;
                if(insert)
                    currentMnemonic++;
            }
            if(insert && char !== '%'){
                (this.mnemonics[currentMnemonic]) ? this.mnemonics[currentMnemonic]+=char : this.mnemonics.push(char);
            }
        }.bind(this));
        return text.replace(/[0-9]/g, '%').replace('%%', '%');
    }
    
    translate(lang, text, dynamicText){
        if(dynamicText){
            text = this.getSourceText(text);    
        }
        this.setState({translated: text});
        this.getWords().then(function(words){
            if(lang === localStorage.getItem('defaultLangi18n')){
                Object.keys(words).forEach(function(word){
                    var langs = words[word];
                    Object.keys(langs).forEach(function(language){
                        if(langs[language].toLowerCase() == text.toLowerCase()){
                            this.setState({translated: word});
                        }    
                    });
                });        
            }else{
                Object.keys(words).forEach(function(word){
                    if(word === text){
                        this.setState({translated: words[word][lang]});
                    }
                }.bind(this));
            }
        }.bind(this));
    }
    
    // static translate(lang, text, pathToWords, defaultLang){
    //     var words = JSON.parse(localStorage.getItem('wordsi18n'));
    //     var wordsKeys;
    //     if(lang === defaultLang){
    //         wordsKeys = Object.keys(words);
    //         for(var i=0; i<wordsKeys.length; i++){
    //             var word = wordsKeys[i];
    //             var langs = wordsKeys[word];
    //             var langsKeys = Object.key(langs);
    //             for(var j=0; j<langsKeys.length; i++){
    //                 if(langsKeys[j].toLowerCase() == text.toLowerCase()){
    //                     return word;
    //                 }
    //             }
    //         }      
    //     }else{
    //         wordsKeys = Object.keys(words);
    //         for(var k=0; k<wordsKeys.length; i++){
    //             if(wordsKeys[k] == text){
    //                 return wordsKeys[k][lang];
    //             }
    //         }
    //     }
    // }
    
    buildDymanicTranslatedText(text){
        if (!String.prototype.splice) {
            String.prototype.splice = function(start, delCount, newSubStr) {
                return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
            };
        }
        var currentIndex = 0;
        text = text.split('');
        var translated = text.map(function(char, index){
            if(char === '%'){
                var charToReturn = this.mnemonics[currentIndex];
                currentIndex++;
                return charToReturn;
            }
            return char;
        }.bind(this));
        return translated.join('');
    }
    
    componentWillMount(){
        var text = this.props.children;
        var lang = this.props.language;
        var dynamic = false;
        
        if(this.props.dynamic)
            dynamic = true;    
            
        this.translate(lang, text, dynamic);
    }
    
    static config(pathToWords, defaultLang){
        if(pathToWords)
            localStorage.setItem('pathToWordsi18n', pathToWords);
        if(defaultLang)
            localStorage.setItem('defaultLangi18n', defaultLang);
    }
    
    render(){
        if(this.dynamicText)
            return this.buildDymanicTranslatedText(this.state.translated);
        return this.state.translated;
    }
}