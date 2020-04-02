import React, { Component } from 'react';
import './App.css';
import Div from './Components/Div';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newStyle: {},
      divs: []
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.addDiv();
  }

  handleTopPos = (e) => {
    const newStyle = {...this.state.newStyle};
    newStyle.top = e.target.value + '%';
    this.setState({
      newStyle
    });
  }

  handleLeftPos = (e) => {
    const newStyle = {...this.state.newStyle};
    newStyle.left = e.target.value + '%';
    this.setState({
      newStyle
    });
  }

  handleWidth = (e) => {
    const newStyle = {...this.state.newStyle};
    newStyle.width = e.target.value + '%';
    this.setState({
      newStyle
    });
  }

  handleHeight = (e) => {
    const newStyle = {...this.state.newStyle};
    newStyle.height = e.target.value + '%';
    this.setState({
      newStyle
    });
  }

  handleBgColour = (e) => {
    const newStyle = {...this.state.newStyle};
    newStyle["background-color"] = e.target.value;
    this.setState({
      newStyle
    });
  }

  addDiv = () => {
    const currentDivs = [...this.state.divs];
    currentDivs.push(this.state.newStyle);
    this.setState({
      divs: currentDivs
    });
  }

  render() {
    return (
      <div className="mainContainer">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="top">Top:</label>
          <input onChange={this.handleTopPos} type="number" min="0" max="100" id="top" />
          <label htmlFor="left">Left:</label>
          <input onChange={this.handleLeftPos} type="number" min="0" max="100" id="left" />
          <label htmlFor="width">Width:</label>
          <input onChange={this.handleWidth} type="number" min="0" max="100" id="width" />
          <label htmlFor="height">Height:</label>
          <input onChange={this.handleHeight} type="number" min="0" max="100" id="height" />
          <label htmlFor="bgColour">Background-Colour:</label>
          <input onChange={this.handleBgColour} type="color" id="bgColour" />
          <button type="submit">Add Div</button>
        </form>
        {
          this.state.divs.map((item, index) => {
            return(
              <Div style={item} key={index} index={index}/>
            );
          })
        }
      </div>
    );
  }
}

export default App;
