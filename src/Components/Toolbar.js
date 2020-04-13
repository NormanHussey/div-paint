import React, { Component } from 'react';

class Toolbar extends Component {
  constructor() {
    super();
    this.state = {
      newStyle: {
        backgroundColor: 'black'
      },
      openNew: false,
      units: {
        top: '%',
        left: '%',
        width: '%',
        height: '%'
      }
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
    newStyle.top = e.target.value + this.state.units.top;
    this.setState({
      newStyle
    });
  }

  handleUnits = (e) => {
    const units = {...this.state.units};
    switch (e.target.className) {
      case 'topUnit':
        units.top = e.target.value;
        break;

      case 'leftUnit':
        units.left = e.target.value;
        break;

      case 'widthUnit':
        units.width = e.target.value;
        break;

      case 'heightUnit':
        units.height = e.target.value;
        break;

      default:
        // do nothing
    }
    this.setState({
      units
    })
  }

  handleLeftPos = (e) => {
    const newStyle = {...this.state.newStyle};
    newStyle.left = e.target.value + this.state.units.left;
    this.setState({
      newStyle
    });
  }

  handleWidth = (e) => {
    const newStyle = {...this.state.newStyle};
    newStyle.width = e.target.value + this.state.units.width;
    this.setState({
      newStyle
    });
  }

  handleHeight = (e) => {
    const newStyle = {...this.state.newStyle};
    newStyle.height = e.target.value + this.state.units.height;
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
            <div className="sizeInput">
              <label htmlFor="top">Top:</label>
              <input onChange={this.handleTopPos} type="number" min="0" max="100" id="top" required/>
              <select className="topUnit" onChange={this.handleUnits}>
                <option value="%">%</option>
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="vw">vw</option>
                <option value="vh">vh</option>
                <option value="vmin">vmin</option>
                <option value="vmax">vmax</option>
              </select>
            </div>
            <div className="sizeInput">
              <label htmlFor="left">Left:</label>
              <input onChange={this.handleLeftPos} type="number" min="0" max="100" id="left" required/>
              <select className="leftUnit" onChange={this.handleUnits}>
                <option value="%">%</option>
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="vw">vw</option>
                <option value="vh">vh</option>
                <option value="vmin">vmin</option>
                <option value="vmax">vmax</option>
              </select>
            </div>
            <div className="sizeInput">
              <label htmlFor="width">Width:</label>
              <input onChange={this.handleWidth} type="number" min="0" max="100" id="width" required/>
              <select className="widthUnit" onChange={this.handleUnits}>
                <option value="%">%</option>
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="vw">vw</option>
                <option value="vh">vh</option>
                <option value="vmin">vmin</option>
                <option value="vmax">vmax</option>
              </select>
            </div>
            <div className="sizeInput">
              <label htmlFor="height">Height:</label>
              <input onChange={this.handleHeight} type="number" min="0" max="100" id="height" required/>
              <select className="heightUnit" onChange={this.handleUnits}>
                <option value="%">%</option>
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="vw">vw</option>
                <option value="vh">vh</option>
                <option value="vmin">vmin</option>
                <option value="vmax">vmax</option>
              </select>
            </div>
            <label htmlFor="bgColour">Background:</label>
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