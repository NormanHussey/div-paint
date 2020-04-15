import React, { Component } from 'react';

class DetailPanel extends Component {
  constructor() {
      super();
      this.state = {
          style: {},
          units: {}
      };
  }

  componentDidMount() {

    const regex = /([a-z%].*)/;
    const top = this.props.style.top.split(regex);
    const left = this.props.style.left.split(regex);
    const width = this.props.style.width.split(regex);
    const height = this.props.style.height.split(regex);
    
    const styleSplit = {
      top,
      left,
      width,
      height
    }

    const units = {
      top: styleSplit.top[1],
      left: styleSplit.left[1],
      width: styleSplit.width[1],
      height: styleSplit.height[1]
    };

    this.setState({
      style: this.props.style,
      units
    });
  }

  // componentWillReceiveProps(props) {
  //   this.setState({
  //     style: props.style
  //   });
  // }

  handleSubmit = (e, id) => {
    e.preventDefault();
    this.props.updateDiv(id, this.state.style);
  }

  handleInput = (e) => {
    const style = {...this.state.style};

    switch (e.target.className) {
      case 'topInput':
        style.top = e.target.value + this.state.units.top;
        break;

      case 'leftInput':
        style.left = e.target.value + this.state.units.left;
        break;

      case 'widthInput':
        style.width = e.target.value + this.state.units.width;
        break;

      case 'heightInput':
        style.height = e.target.value + this.state.units.height;
        break;

      default:
        // do nothing
    }

    this.setState({
      style
    });
  }

  handleUnits = (e) => {
    const units = {...this.state.units};
    const style = {...this.state.style};

    switch (e.target.className) {
      case 'topUnit':
        units.top = e.target.value;
        style.top = parseFloat(style.top) + units.top;
        break;

      case 'leftUnit':
        units.left = e.target.value;
        style.left = parseFloat(style.left) + units.left;
        break;

      case 'widthUnit':
        units.width = e.target.value;
        style.width = parseFloat(style.width) + units.width;
        break;

      case 'heightUnit':
        units.height = e.target.value;
        style.height = parseFloat(style.height) + units.height;
        break;

      default:
        // do nothing
    }
    this.setState({
      units,
      style
    })
  }

  handleBgColour = (e) => {
    const style = {...this.state.style};
    style.backgroundColor = e.target.value;
    this.setState({
      style
    });
  }

  render() {
    const panelStyle = {
      zIndex: this.props.index + 1
    };
    const div = this.props.div;
    const id = div.id;
    const regex = /([a-z%].*)/;
    const top = this.props.style.top.split(regex);
    const left = this.props.style.left.split(regex);
    const width = this.props.style.width.split(regex);
    const height = this.props.style.height.split(regex);
    const style = {
      top,
      left,
      width,
      height
    }
    return (
      <div className="panel" style={panelStyle}>
      <form onSubmit={(e) => this.handleSubmit(e, id) }>
        <label htmlFor={"name" + id}>Name:</label>
        <input type="text" id={"name" + id} name={"name" + id} defaultValue={div.name}/>
        <div className="sizeInput">
          <label htmlFor={"top" + id}>Top:</label>
          <input className="topInput" onChange={this.handleInput} type="number" id={"top" + id} name={"top" + id} value={style.top[0]} step="0.001"/>
          <select className="topUnit" onChange={this.handleUnits} value={style.top[1]}>
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
          <label htmlFor={"left" + id}>Left:</label>
          <input className="leftInput" onChange={this.handleInput} type="number" id={"left" + id} name={"left" + id} value={style.left[0]} step="0.001"/>
          <select className="leftUnit" onChange={this.handleUnits} defaultValue={style.left[1]}>
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
          <label htmlFor={"width" + id}>Width:</label>
          <input className="widthInput" onChange={this.handleInput} type="number" id={"width" + id} name={"width" + id} defaultValue={style.width[0]} step="0.001"/>
          <select className="widthUnit" onChange={this.handleUnits} defaultValue={style.width[1]}>
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
          <label htmlFor={"height" + id}>Height:</label>
          <input className="heightInput" onChange={this.handleInput} type="number" id={"height" + id} name={"height" + id} defaultValue={style.height[0]} step="0.001"/>
          <select className="heightUnit" onChange={this.handleUnits} defaultValue={style.height[1]}>
            <option value="%">%</option>
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="vw">vw</option>
            <option value="vh">vh</option>
            <option value="vmin">vmin</option>
            <option value="vmax">vmax</option>
          </select>
        </div>
        <div>
          <label htmlFor="bgColour">Background:</label>
          <input onChange={this.handleBgColour} type="color" id="bgColour" defaultValue={div.style.backgroundColor}/>
        </div>
        <button type="submit">Apply Changes</button>
      </form>
    </div>
    );
  }
}

export default DetailPanel;