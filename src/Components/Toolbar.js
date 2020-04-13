import React, { Component } from 'react';

class Toolbar extends Component {
  constructor() {
    super();
    this.state = {
      newStyle: {
        backgroundColor: 'black'
      },
      openNew: false
    }
  }

  componentDidMount() {
    window.addEventListener('keypress', this.shortcutKey);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.addDiv(this.state.newStyle);
    this.setState({
      openNew: false
    });
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

  toggleNew = () => {
    this.setState({
      openNew: !this.state.openNew
    });
  }

  render() {
    let moveClass = '';
    if (this.props.moving) {
      moveClass = 'activeButton';
    }
    return(
      <div className="toolbar">
        {
          this.state.openNew ? 
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="top">Top:</label>
            <input onChange={this.handleTopPos} type="number" min="0" max="100" id="top" required/>
            <label htmlFor="left">Left:</label>
            <input onChange={this.handleLeftPos} type="number" min="0" max="100" id="left" required/>
            <label htmlFor="width">Width:</label>
            <input onChange={this.handleWidth} type="number" min="0" max="100" id="width" required/>
            <label htmlFor="height">Height:</label>
            <input onChange={this.handleHeight} type="number" min="0" max="100" id="height" required/>
            <label htmlFor="bgColour">Background-Color:</label>
            <input onChange={this.handleBgColour} type="color" id="bgColour" />
            <button type="submit">
                {
                  this.props.selected ? 'Add Child' : 'Add'
                }
            </button>
          </form>
          : null
        }
        <button onClick={this.toggleNew}>{ this.state.openNew ? "Cancel" : "New" }</button>
        <button className={moveClass} onClick={this.toggleMove}>Move</button>
        <button onClick={this.props.unselectAll}>Unselect All</button>
        <button onClick={this.props.deleteDiv}>Delete</button>
        <button onClick={this.props.undo}>Undo</button>
        <button onClick={this.props.redo}>Redo</button>
        <button onClick={this.props.copyDiv}>Copy</button>
        <button onClick={this.props.pasteDiv}>Paste</button>
      </div>
    );
  }
}

export default Toolbar;