import React, { Component } from 'react';
import './App.css';

import Div from './Components/Div';
import Toolbar from './Components/Toolbar';

import removeFromArray from './functions/removeFromArray';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newStyle: {
        "background-color": 'black'
      },
      divs: [],
      selected: []
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.selected.length === 0) {
      this.addDiv();
    } else {
      this.changeDivs();
    }
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
    const divs = [...this.state.divs];
    divs.push(this.state.newStyle);
    this.setState({
      divs
    });
  }

  changeDivs = () => {
    const divs = [...this.state.divs];
    this.state.selected.forEach((selection) => {
      divs[selection.index] = this.state.newStyle;
    });
    this.setState({
      divs
    });
  }

  select = (index) => {
    const selected = [...this.state.selected];
    const selection = {
      index: index,
      style: this.state.divs[index]
    };
    selected.push(selection);

    this.setState({
      selected
    });
  }

  unselect = (index) => {
    const selected = [...this.state.selected];
    removeFromArray(selected[index], selected);
    this.setState({
      selected
    });
  }

  render() {
    return (
      <div className="mainContainer">
        <Toolbar />
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="top">Top:</label>
          <input onChange={this.handleTopPos} type="number" min="0" max="100" id="top" />
          <label htmlFor="left">Left:</label>
          <input onChange={this.handleLeftPos} type="number" min="0" max="100" id="left" />
          <label htmlFor="width">Width:</label>
          <input onChange={this.handleWidth} type="number" min="0" max="100" id="width" />
          <label htmlFor="height">Height:</label>
          <input onChange={this.handleHeight} type="number" min="0" max="100" id="height" />
          <label htmlFor="bgColour">Background-Color:</label>
          <input onChange={this.handleBgColour} type="color" id="bgColour" />
          <button type="submit">
            {
              this.state.selected.length === 0 ? 'Add' : 'Change'
            }
          </button>
        </form>
        {
          this.state.divs.map((item, index) => {
            return(
              <Div select={this.select} unselect={this.unselect} style={item} key={index} index={index}/>
            );
          })
        }
      </div>
    );
  }
}

export default App;
