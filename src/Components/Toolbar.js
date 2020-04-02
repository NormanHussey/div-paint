import React, { Component } from 'react';

class Toolbar extends Component {
  constructor() {
    super();
    this.state = {
      newStyle: {
        "background-color": 'black'
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.props.selected) {
      this.props.addDiv(this.state.newStyle);
    } else {
      this.props.changeDivs(this.state.newStyle);
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

  render() {
    return(
      <div>
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
                this.props.selected ? 'Change' : 'Add'
              }
          </button>
        </form>
      </div>
    );
  }
}

export default Toolbar;