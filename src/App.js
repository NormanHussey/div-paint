import React, { Component } from 'react';
import './App.css';

import { v4 as uuid } from 'uuid';

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
    const id = uuid();
    const divInfo = {
      id: id,
      style: style,
      selected: false,
      childDivs: [],
      parents: []
    };
    if (this.state.selected.length > 0) {
      this.state.selected.forEach((item, index) => {
        if (item.parents.length > 0) {
          const parents = [...item.parents];
          parents.push(item.index);
          divInfo.parents = parents;
          let current = divs[parents[0]];
          for (let i = 1; i < parents.length; i++) {
            current = current.childDivs[parents[i]];
          }
          current.childDivs.push(divInfo);
        } else {
          divInfo.parents.push(item.index);
          divs[item.index].childDivs.push(divInfo);
        }
      });
    } else {
      divs.push(divInfo);
    }
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

  select = (index, style, parents, moveCoords) => {
    const selected = [...this.state.selected];
    const divs = [...this.state.divs];
    const selection = {
      index: index,
      style: style,
      parents: parents,
      moveCoords: moveCoords
    };
    selected.push(selection);
    if (selection.parents.length > 0) {
      let current = divs[selection.parents[0]];
      for (let i = 1; i < selection.parents.length; i++) {
        current = current.childDivs[selection.parents[i]];
      }
      console.log(current);
      current.selected = true;
    } else {
      divs[index].selected = true;
    }

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
        } >
        <Toolbar toggleMove={this.toggleMove} addDiv={this.addDiv} changeDivs={this.changeDivs} selected={this.state.selected.length > 0} unselectAll={this.unselectAll} />
        {
          this.state.divs.map((item, index) => {
            return(
              <Div selected={item.selected} select={this.select} unselect={this.unselect} style={item.style} key={item.id} index={index} childDivs={item.childDivs} parents={item.parents} />
            );
          })
        }
      </div>
    );
  }
}

export default App;
