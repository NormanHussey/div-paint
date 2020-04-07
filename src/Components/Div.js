import React, { Component } from 'react';

class Div extends Component {
  constructor() {
    super();
    this.ref = React.createRef();
    // this.state = {
    //     position: {}
    // }
  }

  componentDidMount() {
    // this.setState({
    //   position: this.getPosition()
    // });
  }

  getPosition = () => {
    return {
      top: this.ref.current.offsetTop,
      left: this.ref.current.offsetLeft,
      width: this.ref.current.offsetWidth,
      height: this.ref.current.offsetHeight
    };
  }

  toggleSelect = (e) => {
    e.stopPropagation();
    const position = this.getPosition();
    const mouseCoords = this.getMouseCoords(e);
    // console.log(mouseCoords.x, mouseCoords.y);
    const relativeCoords = {
      x: mouseCoords.x - position.left,
      y: mouseCoords.y - position.top
    };
    // console.log(relativeCoords);
    if (!this.props.selected) {
        this.props.select(this.props.id, relativeCoords, position);
    } else {
        this.props.unselect(this.props.id);
    }
  }

  getMouseCoords = (e) => {
    return {
        x: e.clientX,
        y: e.clientY
      };
  }
  
  render() {
    let selectedClass = 'newDiv';
    if (this.props.selected) {
      selectedClass += ' selected';
    }
    return (
      <div ref={this.ref} onClick={this.toggleSelect} className={selectedClass} style={this.props.style}>
        {
          this.props.childDivs ?
          this.props.childDivs.map((item, index) => {
            return (
              <Div updateDims={this.props.updateDims} selected={item.selected} select={this.props.select} unselect={this.props.unselect} style={item.style} key={item.id} id={item.id} index={index} childDivs={item.childDivs} parents={item.parents} />
            );
          })
          : null
        }
      </div>
    );
  }
}

export default Div;