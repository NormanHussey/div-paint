import React, { Component } from 'react';

class Toolbar extends Component {
  constructor() {
    super();
    this.state = {
      newStyle: {
        backgroundColor: 'black',
        top: 0,
        left: 0,
        width: 0,
        height: 0
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

  handleInputs = (e) => {
    const newStyle = {...this.state.newStyle};

    switch (e.target.className) {
      case 'topInput':
        newStyle.top = e.target.value + this.state.units.top;
        break;

      case 'leftInput':
        newStyle.left = e.target.value + this.state.units.left;
        break;

      case 'widthInput':
        newStyle.width = e.target.value + this.state.units.width;
        break;

      case 'heightInput':
        newStyle.height = e.target.value + this.state.units.height;
        break;

      default:
        // do nothing
    }

    this.setState({
      newStyle
    });
  }

  handleUnits = (e) => {
    const units = {...this.state.units};
    const newStyle = {...this.state.newStyle};

    switch (e.target.className) {
      case 'topUnit':
        units.top = e.target.value;
        newStyle.top = parseInt(newStyle.top) + units.top;
        break;

      case 'leftUnit':
        units.left = e.target.value;
        newStyle.left = parseInt(newStyle.left) + units.left;
        break;

      case 'widthUnit':
        units.width = e.target.value;
        newStyle.width = parseInt(newStyle.width) + units.width;
        break;

      case 'heightUnit':
        units.height = e.target.value;
        newStyle.height = parseInt(newStyle.height) + units.height;
        break;

      default:
        // do nothing
    }
    this.setState({
      units,
      newStyle
    })
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
              <input className="topInput" onChange={this.handleInputs} type="number" min="0" max="100" id="top" required/>
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
              <input className="leftInput" onChange={this.handleInputs} type="number" min="0" max="100" id="left" required/>
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
              <input className="widthInput" onChange={this.handleInputs} type="number" min="0" max="100" id="width" required/>
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
              <input className="heightInput" onChange={this.handleInputs} type="number" min="0" max="100" id="height" required/>
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