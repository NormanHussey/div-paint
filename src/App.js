import React, { Component } from 'react';
import './App.css';

import Div from './Components/Div';
import Toolbar from './Components/Toolbar';

class App extends Component {
  constructor() {
    super();
    this.boardRef = React.createRef();
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
    const divInfo = {
      style: style,
      selected: false
    };
    divs.push(divInfo);
    this.setState({
      divs
    });
  }

  changeDivs = (style) => {
    const divs = [...this.state.divs];
    this.state.selected.forEach((selection) => {
      divs[selection.index].style = style;
    });
    this.setState({
      divs
    });
  }

  select = (index, moveCoords) => {
    const selected = [...this.state.selected];
    const divs = [...this.state.divs];
    const selection = {
      index: index,
      style: divs[index].style,
      moveCoords: moveCoords
    };
    selected.push(selection);
    divs[index].selected = true;

    this.setState({
      selected,
      divs
    });
  }

  unselect = (index) => {
    const selected = [...this.state.selected];
    const divs = [...this.state.divs];
    const newSelected = selected.filter((item) => {
      if (item.index === index) {
        divs[index].selected = false;
        return false;
      } else {
        return true;
      }
    });
    this.setState({
      selected: newSelected,
      divs
    });
  }

  unselectAll = () => {
    const divs = [...this.state.divs];
    this.state.selected.forEach((item) => {
      console.log(item);
      divs[item.index].selected = false;
    });
    this.setState({
      divs,
      selected: []
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
    const board = {
      width: this.boardRef.current.offsetWidth,
      height: this.boardRef.current.offsetHeight
    };
    if (this.state.moving && this.state.selected.length > 0) {
      const divs = [...this.state.divs];
      this.state.selected.forEach((selection) => {
        const style = {...divs[selection.index].style};
        style.top = ((mouseCoords.y - selection.moveCoords.y) / board.height) * 100 + '%';
        style.left = ((mouseCoords.x - selection.moveCoords.x) / board.width) * 100 + '%';
        divs[selection.index].style = style;
      });
      this.setState({
        divs
      });
    }
  }

  render() {
    return (
      <div ref={this.boardRef} className="mainContainer" onMouseMove={ (e) => {
            if (this.state.moving) {
              this.handleMouseMove(e);
            }
          }
        } onClick={this.unselectAll} >
        <Toolbar toggleMove={this.toggleMove} addDiv={this.addDiv} changeDivs={this.changeDivs} selected={this.state.selected.length > 0} />
        {
          this.state.divs.map((item, index) => {
            return(
              <Div selected={item.selected} setClickPosition={this.getClickPosition} select={this.select} unselect={this.unselect} style={item.style} key={index} index={index} />
            );
          })
        }
      </div>
    );
  }
}

export default App;
