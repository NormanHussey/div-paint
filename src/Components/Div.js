import React, { Component } from 'react';

class Div extends Component {
  constructor() {
    super();
    this.state = {
        style: {},
        index: 0
    }
  }

  componentDidMount() {
    const style = this.props.style;
    // const style = {
    //     top: this.props.top + '%',
    //     left: this.props.left + '%'
    // };
    this.setState({
        style,
        index: this.props.index
    }, 
        () => { console.log(this.state.style)}
    );
  }
  
  render() {
    return (
      <div className="addedDiv" style={this.state.style}>

      </div>
    );
  }
}

export default Div;