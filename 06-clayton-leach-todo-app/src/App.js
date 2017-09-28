import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import './font-awesome-4.7.0/css/font-awesome.css'
import './App.css';
import './img/checker.jpg'

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

    return [h, Math.abs(s), l];
}

class TODOColorPicker extends Component {
    constructor(){
        super();
        this.state = {
            'currentColor': {
                'r': 255,
                'g': 255,
                'b': 255,
                'h': 0,
                's': 0.0,
                'l': 1.0,
                'a': 1.0
            },
            'mouseDown': false,
        }
    }

    updateHSL(){
        var newHSL = rgbToHSL(
            this.state['currentColor']['r'],
            this.state['currentColor']['g'],
            this.state['currentColor']['b']
        )
        this.setState((prevState, props) => {
            prevState['currentColor']['h'] = newHSL[0];
            prevState['currentColor']['s'] = newHSL[1];
            prevState['currentColor']['l'] = newHSL[2];
            return prevState;
        });
        var hChannel = document.getElementById("list-" + this.props.listKey + "-color-wheel-slider-h")
        var sChannel = document.getElementById("list-" + this.props.listKey + "-color-wheel-slider-s")
        var lChannel = document.getElementById("list-" + this.props.listKey + "-color-wheel-slider-l")
        hChannel.value = this.state['currentColor']['h'];
        sChannel.value = this.state['currentColor']['s'];
        lChannel.value = this.state['currentColor']['l'];
    }

    updateRGB(){
        var newRGB = hslToRGB(
            this.state['currentColor']['h'] / 360,
            this.state['currentColor']['s'],
            this.state['currentColor']['l'],
        )
        this.setState((prevState, props) => {
            prevState['currentColor']['r'] = newRGB[0];
            prevState['currentColor']['g'] = newRGB[1];
            prevState['currentColor']['b'] = newRGB[2];
            return prevState;
        });
        var hChannel = document.getElementById("list-" + this.props.listKey + "-color-wheel-slider-r")
        var sChannel = document.getElementById("list-" + this.props.listKey + "-color-wheel-slider-g")
        var lChannel = document.getElementById("list-" + this.props.listKey + "-color-wheel-slider-b")
        hChannel.value = this.state['currentColor']['r'];
        sChannel.value = this.state['currentColor']['g'];
        lChannel.value = this.state['currentColor']['b'];
    }

    handleChange(event, channel){
        var activeSlider = document.getElementById("list-" + this.props.listKey + "-color-wheel-slider-" + channel)
        switch(channel){
            case 'r':
            case 'g':
            case 'b':
                this.setState((prevState, props) => {
                    prevState['currentColor'][channel] = activeSlider.value * 1.0;
                    return prevState;
                });
                this.updateHSL();
            break;
            case 'h':
            case 's':
            case 'l':
                this.setState((prevState, props) => {
                    prevState['currentColor'][channel] = activeSlider.value * 1.0;
                    return prevState;
                });
                this.updateRGB();
            break;
            case 'a':
                this.setState((prevState, props) => {
                    prevState['currentColor'][channel] = activeSlider.value * 1.0;
                    return prevState;
                });
            break;
            default:
            break;
        }

    }

    createHashCode(){
        var hashCode = '#';
        var channels = ['r','g','b']
        for (var i = 0; i < channels.length; i++){
            var contents = this.state['currentColor'][channels[i]].toString(16).toUpperCase();
            if(contents.length < 2){
                contents = "0" + contents;
            }
            hashCode += contents;
        }
        return hashCode;
    }

    createRGBAString(){
        var RGBAString = "rgba("
        RGBAString += this.state['currentColor']['r'] + ', ';
        RGBAString += this.state['currentColor']['g'] + ', ';
        RGBAString += this.state['currentColor']['b'] + ', ';
        RGBAString += this.state['currentColor']['a'] + ')';
        return RGBAString;
    }

    componentDidMount(){
        //Obtain the canvas and context
        var canvas = document.getElementById("color-picker-canvas-" + this.props.listKey)
        canvas.width = "200";
        canvas.height = "200";
        var context = canvas.getContext('2d');
        //Create blank 200x200 image and obtain handle for its data
        var colorWheel = context.createImageData(200, 200);
        var imageData = colorWheel.data;
        for(var i = 0.0; i < 100.0; i = i + 1.0){
            for(var j = 0.0; j < 360.0; j = j + 0.25){
                //Find the image coordinates from the polar coordinates of a circle
                var x = Math.round(((i * Math.cos(j * Math.PI / 180.0))) + 100);
                var y = Math.round(((i * Math.sin(j * Math.PI / 180.0))) + 100);

                //Calculate the color
                var pixelColor = hslToRGB(j * Math.PI / 180.0 / ( 2 * Math.PI), i / 99, 0.55);

                //Store the color in the image.
                imageData[((x + 200 * y) * 4)] = pixelColor[0]; //Red pixel
                imageData[((x + 200 * y) * 4) + 1] = pixelColor[1]; //Green pixel
                imageData[((x + 200 * y) * 4) + 2] = pixelColor[2]; //Blue pixel
                imageData[((x + 200 * y) * 4) + 3] = 255; //Alpha
            }
        }
        //Put the image into the context.
        context.putImageData(colorWheel, 0, 0);

        canvas.onmousemove = function(evt){
            if(this.state.mouseDown){
                var mouseX;
                var mouseY;
                if(evt.offsetX) {
                    mouseX = evt.offsetX;
                    mouseY = evt.offsetY;
                } else if(evt.layerX){
                    mouseX = evt.layerX;
                    mouseY = evt.layerY;
                }

                var color = context.getImageData(mouseX, mouseY, 1, 1).data;

                if(color[3] !== 0){
                    this.setState((prevState, props) => {
                        prevState['currentColor']['r'] = color[0];
                        prevState['currentColor']['g'] = color[1];
                        prevState['currentColor']['b'] = color[2];
                    });
                    this.updateHSL();
                    this.updateRGB();
                }
            }

        }.bind(this);

        canvas.addEventListener("mousedown", function(evt) {
            this.setState((prevState, props) => {
                prevState.mouseDown = true;
                return prevState;
            });
        }.bind(this));
        canvas.addEventListener("mouseup", function(evt) {
            this.setState((prevState, props) => {
                prevState.mouseDown = false;
                return prevState;
            });
        }.bind(this));
    }

    render() {
        return (
            <div className="list-color-picker-container">
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
                    className="list-color-wheel-slider-container"
                    style={{
                        background: "linear-gradient(to right, rgba(" +
                                                          0 + "," +
                            this.state['currentColor']['g'] + "," +
                            this.state['currentColor']['b'] + "," +
                                                        1.0 + "), rgba(" +
                                                        255 + "," +
                            this.state['currentColor']['g'] + "," +
                            this.state['currentColor']['b'] + "," +
                                                        1.0 + "))"
                    }}>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        step="1"
                        id={"list-" + this.props.listKey + "-color-wheel-slider-r"}
                        defaultValue={this.state['currentColor']['r']}
                        onChange={(e, channel) => this.handleChange(e, 'r')}
                        onInput={(e, channel) => this.handleChange(e, 'r')}
                        className="list-color-wheel-sliders">
                    </input>
                </div>
                <div
                    className="list-color-wheel-slider-container"
                    style={{
                        background: "linear-gradient(to right, rgba(" +
                            this.state['currentColor']['r'] + "," +
                                                          0 + "," +
                            this.state['currentColor']['b'] + "," +
                                                        1.0 + "), rgba(" +
                            this.state['currentColor']['r'] + "," +
                                                        255 + "," +
                            this.state['currentColor']['b'] + "," +
                                                        1.0 + "))"
                    }}>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        step="1"
                        id={"list-" + this.props.listKey + "-color-wheel-slider-g"}
                        defaultValue={this.state['currentColor']['g']}
                        onChange={(e, channel) => this.handleChange(e, 'g')}
                        onInput={(e, channel) => this.handleChange(e, 'g')}
                        className="list-color-wheel-sliders">
                    </input>
                </div>
                <div
                    className="list-color-wheel-slider-container"
                    style={{
                        background: "linear-gradient(to right, rgba(" +
                            this.state['currentColor']['r'] + "," +
                            this.state['currentColor']['g'] + "," +
                                                          0 + "," +
                                                        1.0 + "), rgba(" +
                            this.state['currentColor']['r'] + "," +
                            this.state['currentColor']['g'] + "," +
                                                        255 + "," +
                                                        1.0 + "))"
                    }}>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        step="1"
                        id={"list-" + this.props.listKey + "-color-wheel-slider-b"}
                        defaultValue={this.state['currentColor']['b']}
                        onChange={(e, channel) => this.handleChange(e, 'b')}
                        onInput={(e, channel) => this.handleChange(e, 'b')}
                        className="list-color-wheel-sliders">
                    </input>
                </div>
                <hr></hr>
                <div
                    className="list-color-wheel-slider-container"
                    style={{
                        background: "linear-gradient(to right, hsla(" +
                                                          0 + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + ") 0%, hsla(" +
                                                         60 + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + ") 16.66%, hsla(" +
                                                        120 + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + ") 33.33%, hsla(" +
                                                        180 + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + ") 50%, hsla(" +
                                                        240 + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + ") 66.66%, hsla(" +
                                                        300 + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + ") 83.33%, hsla(" +
                                                        360 + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + ") 100%)"
                    }}>
                    <input
                        type="range"
                        min="0"
                        max="359"
                        step="0.1"
                        id={"list-" + this.props.listKey + "-color-wheel-slider-h"}
                        defaultValue={this.state['currentColor']['h']}
                        onChange={(e, channel) => this.handleChange(e, 'h')}
                        onInput={(e, channel) => this.handleChange(e, 'h')}
                        className="list-color-wheel-sliders">
                    </input>
                </div>
                <div
                    className="list-color-wheel-slider-container"
                    style={{
                        background: "linear-gradient(to right, hsla(" +
                            this.state['currentColor']['h'] + "," +
                                                          0 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + "), hsla(" +
                            this.state['currentColor']['h'] + "," +
                                                        100 + "%," +
                            this.state['currentColor']['l'] * 100 + "%," +
                                                        1.0 + "))"
                    }}>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.001"
                        id={"list-" + this.props.listKey + "-color-wheel-slider-s"}
                        defaultValue={this.state['currentColor']['s']}
                        onChange={(e, channel) => this.handleChange(e, 's')}
                        onInput={(e, channel) => this.handleChange(e, 's')}
                        className="list-color-wheel-sliders">
                    </input>
                </div>
                <div
                    className="list-color-wheel-slider-container"
                    style={{
                        background: "linear-gradient(to right, hsla(" +
                            this.state['currentColor']['h'] + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                                                          0 + "%," +
                                                        1.0 + ") 0%, hsla(" +
                            this.state['currentColor']['h'] + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                                                      16.66 + "%," +
                                                        1.0 + ") 16.66%, hsla(" +
                            this.state['currentColor']['h'] + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                                                      33.33 + "%," +
                                                        1.0 + ") 33.33%, hsla(" +
                            this.state['currentColor']['h'] + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                                                         50 + "%," +
                                                        1.0 + ") 50%, hsla(" +
                            this.state['currentColor']['h'] + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                                                      66.66 + "%," +
                                                        1.0 + ") 66.66%, hsla(" +
                            this.state['currentColor']['h'] + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                                                      83.33 + "%," +
                                                        1.0 + ") 83.33%, hsla(" +
                            this.state['currentColor']['h'] + "," +
                            this.state['currentColor']['s'] * 100 + "%," +
                                                        100 + "%," +
                                                        1.0 + "))"
                    }}>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.001"
                        id={"list-" + this.props.listKey + "-color-wheel-slider-l"}
                        defaultValue={this.state['currentColor']['l']}
                        onChange={(e, channel) => this.handleChange(e, 'l')}
                        onInput={(e, channel) => this.handleChange(e, 'l')}
                        className="list-color-wheel-sliders">
                    </input>
                </div>
                <hr></hr>
                <div className="list-color-wheel-slider-container"
                style={{
                    background: "linear-gradient(to right, rgba(" +
                        this.state['currentColor']['r'] + "," +
                        this.state['currentColor']['g'] + "," +
                        this.state['currentColor']['b'] + "," +
                                                    0.0 + "), rgba(" +
                        this.state['currentColor']['r'] + "," +
                        this.state['currentColor']['g'] + "," +
                        this.state['currentColor']['b'] + "," +
                                                    1.0 + ")), url(./img/checker.jpg)",
                    backgroundRepeat: 'repeat'
                }}>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.001"
                        id={"list-" + this.props.listKey + "-color-wheel-slider-a"}
                        defaultValue={this.state['currentColor']['a']}
                        onChange={(e, channel) => this.handleChange(e, 'a')}
                        onInput={(e, channel) => this.handleChange(e, 'a')}
                        className="list-color-wheel-sliders">
                    </input>
                </div>
                <hr></hr>
                <div>
                    <div
                        className="list-color-wheel-labels-container">
                        <label>{this.createHashCode()}</label>
                        <br></br>
                        <label>{this.createRGBAString()}</label>
                        <br></br>
                        <label
                            className="list-color-wheel-swatch"
                            style={{
                                background: "linear-gradient(to left," + this.createRGBAString() + ", " + this.createRGBAString() + "), url(./img/checker.jpg)",
                                backgroundRepeat: 'repeat'
                            }}>
                        </label>
                    </div>
                    <button
                        className="list-color-wheel-controls-submit">
                            Add Color
                    </button>
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
                            <div
                                className={(this.state.lists[key]['collapsed'] ? "collapsed" : "")}>
                                    <TODOColorPicker
                                        listKey={this.state.lists[key]['id']}/>
                                    <table className="list-entry-table">
                                        <tbody>
                                            {this.renderListEntries(key)}
                                        </tbody>
                                    </table>
                            </div>
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
