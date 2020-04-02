import React, { Component } from 'react';

class Div extends Component {
  constructor() {
    super();
    this.state = {
        selected: false
    }
  }

  toggleSelect = () => {
    if (!this.state.selected) {
        this.props.select(this.props.index);
    } else {
        this.props.unselect(this.props.index);
    }
    this.setState({
        selected: !this.state.selected,
    });
  }
  
  render() {
    let selectedClass = 'newDiv';
    if (this.state.selected) {
      selectedClass += ' selected';
    }
    return (
      <div onClick={this.toggleSelect} className={selectedClass} style={this.props.style}>

      </div>
    );
  }
}

export default Div;