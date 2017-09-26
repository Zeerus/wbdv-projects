import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import './font-awesome-4.7.0/css/font-awesome.css'
import './App.css';

class TODOHeader extends Component {
    constructor(){
        super();
        this.state = {
            value: '',
            windowWidth: 0
        }
    }

    handleEnterKey(event) {
        if(event.keyCode === 13){
            event.stopPropagation();
            event.preventDefault();
            document.getElementById("header-button").click();
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleClick(value){
        this.props.onClick(value);
        document.getElementById("header-text-field").value = '';
        this.setState({ value: '' });
        document.getElementById("header-text-field").focus();
    }

    render() {
        return (
            <header>
                <div className="header-container">
                    <div className="header-left">
                        <i className="fa fa-address-book fa-3x header-logo"></i>
                        <h1 className="header-logo-text">TODO:</h1>
                    </div>
                    <div className="header-center">
                        <input
                            className="header-text-field"
                            id="header-text-field"
                            onChange={(e) => this.handleChange(e)}
                            onKeyDown={(e) => this.handleEnterKey(e)}
                            type="text"
                            placeholder="Enter a list name">
                        </input>
                        <button
                            className="header-button"
                            id="header-button"
                            onClick={(value) => this.handleClick(this.state.value)}>
                                Submit
                        </button>
                    </div>
                </div>
            </header>
        );
    }
}

//Thanks wikipedia!
function hslToRGB(h, s, l){
    var r, g, b;

    if(s === 0){
        r = g = b = l;
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

//Thanks again wikipedia!
function rgbToHSL(r, g, b){
    var h, s, l;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    l = (max + min) / 2;
    l = l / 255;

    if(max === min){
        h = s = 0;
    } else {
        if(max === r) h = (60 * ((g - b) / (max - min))) % 360;
        if(max === g) h = (60 * ((b - r) / (max - min))) + 120;
        if(max === b) h = (60 * ((r - g) / (max - min))) + 240;
        if(h < 0) h = 360 + h;

        if(l > 0.5) s = ((max - min) / ( 2 - max - min));
        if(l <= 0.5) s = ((max - min) / (max + min));
    }

    return [h, s, l];
}

class TODOColorPicker extends Component {
    constructor(){
        super();
        this.state = {
            'currentColor': {
                'r': 255,
                'g': 255,
                'b': 255,
                'a': 1.0
            }
        }
    }

    componentDidMount(){
        var canvas = document.getElementById("color-picker-canvas-" + this.props.listKey)
        canvas.width = "200";
        canvas.height = "200";
        var context = canvas.getContext('2d');
        var colorWheel = context.createImageData(200, 200);
        var imageData = colorWheel.data;
        for(var i = 0.0; i < 100.0; i = i + 1.0){
            for(var j = 0.0; j < 360.0; j = j + 0.25){
                //Find the image coordinates.
                var x = Math.round(((i * Math.cos(j * Math.PI / 180.0))) + 100);
                var y = Math.round(((i * Math.sin(j * Math.PI / 180.0))) + 100);


                //  * (Math.PI / 180)

                //Calculate the color
                var pixelColor = hslToRGB(j * Math.PI / 180.0 / ( 2 * Math.PI), i / 99, 0.55);

                imageData[((x + 200 * y) * 4)] = pixelColor[0]; //Red pixel
                imageData[((x + 200 * y) * 4) + 1] = pixelColor[1]; //Green pixel
                imageData[((x + 200 * y) * 4) + 2] = pixelColor[2]; //Blue pixel
                imageData[((x + 200 * y) * 4) + 3] = 255; //Alpha
            }
        }

        context.putImageData(colorWheel, 0, 0);
    }

    render() {
        return (
            <div>
                <div
                    className="list-color-wheel-container">
                    <canvas
                        id={"color-picker-canvas-" + this.props.listKey}
                        className="list-color-picker-canvas">
                        width="200px"
                        height="200px"
                    </canvas>
                </div>
                <div
                    className="list-color-wheel-controls-container">
                        <label className="list-color-wheel-labels">Color:</label>
                        <input
                            type="text"
                            className="list-color-wheel-controls-color">
                        </input>
                        <br></br>
                        <label className="list-color-wheel-labels">R:</label>
                        <input
                            type="text"
                            className="list-color-wheel-controls-channels">
                        </input>
                        <br></br>
                        <label className="list-color-wheel-labels">G:</label>
                        <input
                            type="text"
                            className="list-color-wheel-controls-channels">
                        </input>
                        <br></br>
                        <label className="list-color-wheel-labels">B:</label>
                        <input
                            type="text"
                            className="list-color-wheel-controls-channels">
                        </input>
                </div>
            </div>
        );
    }
}

class TODOListEntry extends Component {
    constructor(){
        super();
        this.state = {
            entryHeight: "20px",
            value: ''
        };
        this.boundResizeTextArea = this.resizeTextArea.bind(this);
    }

    componentDidMount(){
        window.addEventListener('resize', this.boundResizeTextArea);
        this.resizeTextArea();
        document.getElementById('list-entry-text-' + this.props.listEntryKey).focus();
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.boundResizeTextArea)
    }

    handleEnterKey(event) {
        if(event.keyCode === 13){
            this.props.modifyEntry(this.props.listKey, this.props.listEntryKey, this.state.value);
            event.stopPropagation();
            event.preventDefault();
            this.props.addListEntryFunc(this.props.listKey, '');
        }
    }

    resizeTextArea(){
        if(!this.props.collapsed){
            var listEntry = document.getElementById('list-entry-text-' + this.props.listEntryKey);
            listEntry.style.height = "20px";
            var newHeight = listEntry.scrollHeight + 'px';
            listEntry.style.height = newHeight;
            this.setState((prevstate, props) => {
                return {
                    entryHeight: newHeight
                }
            });
        }
    }

    handleUnfocus(){
        this.props.modifyEntry(this.props.listKey, this.props.listEntryKey, this.state.value);
    }

    handleChange(event){
        var textValue = event.target.value;
        this.setState((prevstate, props) => {
            return { value: textValue};
        })
        this.resizeTextArea();
        event.target.focus();
    }

    render() {
        return (
            <tr className="list-entry-row">
                <td className="list-entry-check-container">
                    <button
                        className="list-entry-button-check"
                        onClick={(listKey, listEntryKey) => this.props.checkEntry(this.props.listKey, this.props.listEntryKey)}>
                            <i className={this.props.checked ? "fa fa-check" : "list-entry-button-nocheck"}></i>
                    </button>
                </td>
                <td className="list-entry-text-container">
                    <textarea
                        id={'list-entry-text-' + this.props.listEntryKey}
                        className={"list-entry-text" + (this.props.checked ? " list-entry-text-checked" : "")}
                        onChange={(e) => this.handleChange(e)}
                        onKeyDown={(e) => this.handleEnterKey(e)}
                        onBlur={(e) => this.handleUnfocus(e)}
                        value={this.state.value}
                        type="text"
                        placeholder=" ">
                    </textarea>
                </td>
                <td className="list-entry-button-container">
                    <button
                        className="list-entry-delete-button"
                        onClick={(listKey, listEntry) => this.props.removeEntry(this.props.listKey, this.props.listEntryKey)}>
                            <i className="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        );
    }
}

class TODOList extends Component {
    componentDidMount(){
        this.props.addEntryFunc(this.props.listKey, '');
    }

    render() {
        return (
            <div className="list-header">
                <h1>{this.props.listName}</h1>
                <div className="list-header-button-container">
                    <button
                        id={"list-header-add-entry-button" + this.props.listKey}
                        className="list-header-button"
                        onClick={(listKey) => this.props.addEntryFunc(this.props.listKey, '')}>
                            <i className="fa fa-plus list-header-button-icons"></i>
                    </button>
                    <button
                        id={"list-header-collapse-button" + this.props.listKey}
                        className="list-header-button"
                        onClick={(listKey) => this.props.collapseFunc(this.props.listKey)}>
                            <i className={(this.props.collapsed? "fa fa-caret-right" : "fa fa-caret-down") + " list-header-button-icons"}></i>
                    </button>
                    <button
                        id = {"list-header-delete-button" + this.props.listKey}
                        className="list-header-button"
                        onClick={(listKey) => this.props.deleteFunc(this.props.listKey)}>
                            <i className="fa fa-times list-header-button-icons"></i>
                    </button>
                </div>
            </div>
        );
    }
}

class App extends Component {
    constructor(){
        super();
        this.state = {
            currentKey: 1,
            uniqueListEntryId: 1,
            lists: {}
        }
    }

    addListEntry(listKey, listKeyEntryContents){
        if(listKey && listKey.length){
            this.setState((prevState, props) => {
                var array = prevState.lists;
                array[listKey]['collapsed'] = false;
                var nextId = prevState.uniqueListEntryId;
                var lastObj;
                Object.keys(this.state.lists[listKey]['contents']).map((key) =>{
                    var index = 0;
                    if(this.state.lists[listKey]['contents'][key]['id'] > index){
                        lastObj = this.state.lists[listKey]['contents'][key];
                    }
                    return null;
                });
                if((!lastObj) || (lastObj['text'] && lastObj['text'].length)){
                    array[listKey]['contents'][nextId] = {checked: false, id: nextId, text: listKeyEntryContents};
                    return {
                        lists: prevState.lists,
                        uniqueListEntryId: prevState.uniqueListEntryId + 1,
                        currentKey: prevState.currentKey
                    }
                } else {
                    return {
                        lists: prevState.lists,
                        uniqueListEntryId: prevState.uniqueListEntryId,
                        currentKey: prevState.currentKey
                    }
                }
            });
        }
    }

    checkEntry(listKey, listEntryKey){
        if(listKey && listEntryKey){
            this.setState((prevState, props) => {
                var array = prevState.lists;
                array[listKey]['contents'][listEntryKey]['checked'] = !(array[listKey]['contents'][listEntryKey]['checked']);
                return {
                    lists: array,
                    uniqueListEntryId: prevState.uniqueListEntryId,
                    currentKey: prevState.currentKey
                }
            });
        }
    }

    modifyListEntry(listKey, listEntryKey, content){
        if(listKey && listEntryKey){
            this.setState((prevState, props) => {
                var array = prevState.lists;
                array[listKey]['contents'][listEntryKey]['text'] = content;
                return {
                    lists: array,
                    uniqueListEntryId: prevState.uniqueListEntryId,
                    currentKey: prevState.currentKey
                }
            });
        }
    }

    removeListEntry(listKey, listEntryKey){
        if(listKey && listEntryKey){
            this.setState((prevState, props) => {
                var array = prevState.lists;
                delete array[listKey]['contents'][listEntryKey];
                return {
                    lists: array,
                    uniqueListEntryId: prevState.uniqueListEntryId,
                    currentKey: prevState.currentKey
                }
            })
        }
    }

    renderListEntries(parentListKey){
        return Object.keys(this.state.lists[parentListKey]['contents']).map((key) => {
            return (
                <TODOListEntry
                    key={key}
                    listKey={parentListKey}
                    listEntryKey={this.state.lists[parentListKey]['contents'][key]['id']}
                    checked={this.state.lists[parentListKey]['contents'][key]['checked']}
                    collapsed={this.state.lists[parentListKey]['collapsed']}
                    listEntryText={this.state.lists[parentListKey]['contents'][key]['text']}
                    checkEntry={(listKey, listEntryKey) => this.checkEntry(listKey, listEntryKey)}
                    modifyEntry={(listKey, listEntryKey, content) => this.modifyListEntry(listKey, listEntryKey, content)}
                    removeEntry={(listKey, listEntryKey) => this.removeListEntry(listKey, listEntryKey)}
                    addListEntryFunc={(listKey, listKeyEntryContents) => this.addListEntry(listKey, listKeyEntryContents)}
                />
            );
        });
    }

    addList(listName){
        if(listName && listName.length){
            this.setState((prevState, props) => {
                var nextId = prevState.currentKey.toString();
                prevState.lists[nextId] = {name: listName, id: nextId,collapsed: false, contents: {}};
                return {
                    lists: prevState.lists,
                    currentKey: prevState.currentKey + 1,
                };
            });
        }
    }

    collapseList(listKey){
        if(listKey && listKey.length){
            this.setState((prevState, props) => {
                var array = prevState.lists;
                array[listKey]['collapsed'] = !(array[listKey]['collapsed']);
                return {lists: array};
            });
        }
    }

    removeList(listKey){
        if(listKey && listKey.length){
            this.setState((prevState, props) => {
                var array = prevState.lists;
                delete array[listKey]
                return {lists: array};
            });
        }
    }

    renderLists(){
        return Object.keys(this.state.lists).map((key) => {
                    return (
                        <div className="list-container" key={this.state.lists[key]['id']}>
                            <TODOList
                                listKey={this.state.lists[key]['id']}
                                listName={this.state.lists[key]['name']}
                                collapsed={this.state.lists[key]['collapsed']}
                                addEntryFunc={(listKey, listKeyEntryContents) => this.addListEntry(listKey, listKeyEntryContents)}
                                collapseFunc={(listKey) => this.collapseList(listKey)}
                                deleteFunc={(listKey) => this.removeList(listKey)}
                            />
                            <TODOColorPicker
                                listKey={this.state.lists[key]['id']}/>
                            <table className={"list-entry-table " + (this.state.lists[key]['collapsed'] ? "collapsed" : "")} >
                                <tbody>
                                    {this.renderListEntries(key)}
                                </tbody>
                            </table>
                        </div>
                    )
                });
    }

    render() {
        return (
            <div>
                <div className="header-spacer"></div>
                <TODOHeader
                    onClick={(listName) => this.addList(listName)}
                />
                <div className="lists-area">
                    <CSSTransitionGroup
                        transitionName="list-transition"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                            {this.renderLists()}
                    </CSSTransitionGroup>
                </div>
            </div>
        );
    }
}

export default App;
