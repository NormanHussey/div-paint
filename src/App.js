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
      divRefs: {},
      divDisplay: [],
      selected: [],
      moving: false,
      mouseCoords: {
        x: 0,
        y: 0
      }
    };
  }

  addDiv = (style) => {
    const divDisplay = [...this.state.divDisplay];
    const divRefs = {...this.state.divRefs};
    const id = uuid();
    const divInfo = {
      id: id,
      style: style,
      selected: false,
      childDivs: [],
      parent: 0,
      moveCoords: {
        X: 0,
        y: 0
      }
    };
    divRefs[id] = divInfo;

    if (this.state.selected.length > 0) {
      this.state.selected.forEach((selection, index) => {
        divRefs[id].parent = selection;
        divRefs[selection].childDivs.push(divRefs[id]);
      });
    }
    
    divDisplay.push(divRefs[id]);
    
    this.setState({
      divDisplay,
      divRefs
    });
  }

  changeDivs = (style) => {
    const divDisplay = [...this.state.divDisplay];
    this.state.selected.forEach((selection) => {
      divDisplay[selection.index].style = style;
    });
    this.setState({
      divDisplay
    });
  }

  select = (id, moveCoords, dims) => {
    const selected = [...this.state.selected];
    const divRefs = {...this.state.divRefs};
    divRefs[id].selected = true;
    divRefs[id].moveCoords = moveCoords;
    divRefs[id].width = dims.width;
    divRefs[id].height = dims.height;
    selected.push(id);

    this.setState({
      selected,
      divRefs
    });
  }

  unselect = (id) => {
    const selected = [...this.state.selected];
    const divRefs = {...this.state.divRefs};
    divRefs[id].selected = false;
    const newSelected = selected.filter((selection) => {
      if (selection === id) {
        return false;
      } else {
        return true;
      }
    });
    this.setState({
      selected: newSelected,
      divRefs
    });
  }

  unselectAll = () => {
    const divRefs = {...this.state.divRefs};
    this.state.selected.forEach((id) => {
      divRefs[id].selected = false;
    });

    this.setState({
      divRefs,
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
    const divRefs = {...this.state.divRefs};
    if (this.state.moving && this.state.selected.length > 0) {
        const id = this.state.selected[this.state.selected.length - 1];
        let newSelected = [id];
        if (this.state.selected.length > 1) {
          newSelected = this.state.selected.filter((selectionId) => {
            if (selectionId === id) {
              return true;
            } else {
              divRefs[selectionId].selected = false;
              return false;
            }
          });
        }
        const selection = divRefs[id];
        const style = {...selection.style};
        let width, height;
        if (selection.parent === 0) {
          width = board.width;
          height = board.height;
        } else {
          width = divRefs[selection.parent].width;
          height = divRefs[selection.parent].height;
        }
        style.top = ((mouseCoords.y - selection.moveCoords.y) / height) * 100 + '%';
        style.left = ((mouseCoords.x - selection.moveCoords.x) / width) * 100 + '%';
        selection.style = style;
        divRefs[id] = selection;
      
      this.setState({
        divRefs,
        selected: newSelected
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
          this.state.divDisplay.map((item, index) => {
            if (item.parent === 0) {
              return(
                <Div updateDims={this.updateDims} selected={item.selected} select={this.select} unselect={this.unselect} style={item.style} key={item.id} id={item.id} index={index} childDivs={item.childDivs} parent={item.parent} />
              );
            } else {
              return false;
            }
          })
        }
      </div>
    );
  }
}

export default App;
