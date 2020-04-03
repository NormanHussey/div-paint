import React, { Component } from 'react';

class Div extends Component {
  constructor() {
    super();
    this.ref = React.createRef();
    this.state = {
        selected: false,
        position: {}
    }
  }

  componentDidMount() {
    this.setState({
      position: this.getPosition()
    });
  }

  getPosition = () => {
    return {
      top: this.ref.current.offsetTop,
      left: this.ref.current.offsetLeft
    };
  }

  toggleSelect = (e) => {
    const position = this.getPosition();
    const mouseCoords = this.getMouseCoords(e);
    console.log(mouseCoords.x, mouseCoords.y);
    const relativeCoords = {
      x: mouseCoords.x - position.left,
      y: mouseCoords.y - position.top
    };
    console.log(relativeCoords);
    if (!this.state.selected) {
        this.props.select(this.props.index, relativeCoords);
    } else {
        this.props.unselect(this.props.index);
    }
    this.setState({
        selected: !this.state.selected,
        position
    });
  }

  getMouseCoords = (e) => {
    return {
        x: e.clientX,
        y: e.clientY
      };
  }
  
  render() {
    let selectedClass = 'newDiv';
    if (this.state.selected) {
      selectedClass += ' selected';
    }
    return (
      <div ref={this.ref} onClick={this.toggleSelect} className={selectedClass} style={this.props.style}></div>
    );
  }
}

export default Div;