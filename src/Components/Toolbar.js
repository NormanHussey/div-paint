import React, { Component } from 'react';

class Toolbar extends Component {
  constructor() {
    super();
    this.state = {
      newStyle: {
        backgroundColor: 'black'
      },
      moveActive: false
    }
  }

  componentDidMount() {
    window.addEventListener('keypress', this.shortcutKey);
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
    newStyle.backgroundColor = e.target.value;
    this.setState({
      newStyle
    });
  }

  toggleMove = (e) => {
    if (e) {
      e.stopPropagation();
    }
    this.props.toggleMove();
    this.setState({
      moveActive: !this.state.moveActive
    });
  }

  shortcutKey = (e) => {
    // console.log(e.which);
    switch(e.which) {
      case 109:
        this.toggleMove();
        break;
      default:
        // do nothing
    }
  }

  render() {
    let moveClass = '';
    if (this.state.moveActive) {
      moveClass = 'activeButton';
    }
    return(
      <div className="toolbar">
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
        <button className={moveClass} onClick={this.toggleMove}>Move</button>
      </div>
    );
  }
}

export default Toolbar;