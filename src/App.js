import React, { Component } from 'react';
import './App.css';

import Div from './Components/Div';
import Toolbar from './Components/Toolbar';

import removeFromArray from './functions/removeFromArray';

class App extends Component {
  constructor() {
    super();
    this.state = {
      divs: [],
      selected: [],
      moving: false,
      mouseCoords: {
        x: 0,
        y: 0
      }
    };
  }

  addDiv = (style) => {
    const divs = [...this.state.divs];
    divs.push(style);
    this.setState({
      divs
    });
  }

  changeDivs = (style) => {
    const divs = [...this.state.divs];
    this.state.selected.forEach((selection) => {
      divs[selection.index] = style;
    });
    this.setState({
      divs
    });
  }

  select = (index) => {
    const selected = [...this.state.selected];
    const selection = {
      index: index,
      style: this.state.divs[index]
    };
    selected.push(selection);

    this.setState({
      selected
    });
  }

  unselect = (index) => {
    const selected = [...this.state.selected];
    removeFromArray(selected[index], selected);
    this.setState({
      selected
    });
  }

  toggleMove = () => {
    this.setState({
      moving: !this.state.moving
    });
  }

  handleMouseMove = (e) => {
    const mouseCoords = {
      x: e.clientX,
      y: e.clientY
    };
    if (this.state.moving && this.state.selected.length > 0) {
      const divs = [...this.state.divs];
      this.state.selected.forEach((selection) => {
        const style = {...divs[selection.index]};
        style.top = mouseCoords.y + 'px';
        style.left = mouseCoords.x + 'px';
        divs[selection.index] = style;
      });
      this.setState({
        divs
      });
    }
    // this.setState({
    //   mouseCoords
    // });
  }

  render() {
    return (
      <div className="mainContainer" onMouseMove={ (e) => {
            if (this.state.moving) {
              this.handleMouseMove(e);
            }
          }
        } >
        <Toolbar toggleMove={this.toggleMove} addDiv={this.addDiv} changeDivs={this.changeDivs} selected={this.state.selected.length > 0} />
        {
          this.state.divs.map((item, index) => {
            return(
              <Div select={this.select} unselect={this.unselect} style={item} key={index} index={index}/>
            );
          })
        }
      </div>
    );
  }
}

export default App;
