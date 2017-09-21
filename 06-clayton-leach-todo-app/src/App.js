import React, { Component } from 'react';
import './font-awesome-4.7.0/css/font-awesome.css'
import './App.css';

class TODOHeader extends Component {
    constructor(){
        super();
        this.state = {
            value: ''
        }
    }

    handleEnterKey(event) {
        if(event.keyCode === 13){
            document.getElementById("header-button").click();
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
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
                            onChange={(e) => this.handleChange(e)}
                            onKeyDown={(e) => this.handleEnterKey(e)}
                            type="text"
                            placeholder="Enter a list name">
                        </input>
                        <button
                            className="header-button"
                            id="header-button"
                            onClick={(value) => this.props.onClick(this.state.value)}>
                                Submit
                        </button>
                    </div>
                </div>
            </header>
        );
    }
}

class TODOListEntry extends Component {
    render() {
        return (
            <div></div>
        );
    }
}

class TODOList extends Component {
    render() {
        return (
            <div className="list-container">
                <div className="list-header">
                    <h1>{this.props.listName}</h1>
                    <button
                        className="list-close"
                        onClick={(listKey) => this.props.deleteFunc(this.props.listKey)}>
                            <i className="fa fa-times"></i>
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
            lists: []
        }
    }

    addList(listName){
        if(listName && listName.length){
            var nextIndex = this.state.lists.length
            this.setState((prevState, props) => {
                prevState.lists[nextIndex] = {'name': listName, 'contents': {}};
                return {lists: prevState.lists};
            });
        }
    }

    removeList(listKey){
        if(listKey && listKey.length){
            this.setState((prevState, props) => {
                delete prevState.lists[listKey]
                return {lists: prevState.lists};
            });
        }
    }

    renderLists(){
        return Object.keys(this.state.lists).map((key) => {
                    return (
                        <TODOList
                            key={key}
                            listKey={key}
                            listName={this.state.lists[key]['name']}
                            deleteFunc={(listKey) => this.removeList(listKey)}
                        />
                    )
                });
    }

    render() {
        return (
            <div>
                <TODOHeader
                    onClick={(listName) => this.addList(listName)}
                />
                <div className="lists-area">
                    {this.renderLists()}
                </div>
            </div>
        );
    }
}

export default App;
