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

class TODOListEntry extends Component {
    constructor(){
        super();
        this.state = {
            entryHeight: "20px"
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
            event.stopPropagation();
            event.preventDefault();
            this.props.addListEntryFunc(this.props.listKey, '');
        }
        if(event.keyCode === 8){
            var listEntry = document.getElementById('list-entry-text-' + this.props.listEntryKey);
            if (listEntry && listEntry.value && listEntry.value.length === 1){
                listEntry.value = '';
                this.props.modifyEntry(this.props.listKey, this.props.listEntryKey, '');
            } else {
                var selectionStart = listEntry.selectionStart;
                var selectionEnd = listEntry.selectionEnd;
                if (selectionStart === 0 && selectionEnd === listEntry.value.length){
                    listEntry.value = '';
                    this.props.modifyEntry(this.props.listKey, this.props.listEntryKey, '');
                }
            }
        }
    }

    resizeTextArea(){
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

    handleChange(event){
        this.resizeTextArea();
        this.props.modifyEntry(this.props.listKey, this.props.listEntryKey, event.target.value);
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
                        value={this.props.listEntryText}
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
                var nextId = prevState.uniqueListEntryId;
                array[listKey]['contents'][nextId] = {checked: false, id: nextId, text: listKeyEntryContents};
                array[listKey]['collapsed'] = false;
                return {
                    lists: prevState.lists,
                    uniqueListEntryId: prevState.uniqueListEntryId + 1,
                    currentKey: prevState.currentKey
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
