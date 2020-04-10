import React, { Component } from 'react';
import './App.css';

import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import removeFromArray from './functions/removeFromArray';

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
      },
      history: {},
      redoState: {}
    };
  }

  // componentDidMount() {
  //   const history = [];
  //   const stateClone = _.cloneDeep(this.state);
  //   history.push(stateClone);
  //   this.setState({
  //     history,
  //     redoState: stateClone
  //   });
  // }

  // updateHistory = () => {
  //   const history = [...this.state.history];
  //   const stateClone = _.cloneDeep(this.state);
  //   const redoState = _.cloneDeep(history[history.length - 1]);
  //   history.push(stateClone);
  //   this.setState({
  //     history,
  //     redoState
  //   });
  // }

  cloneState = () => {
   const divRefsClone = _.cloneDeep(this.state.divRefs);
   console.log('cloneState', divRefsClone);
   const history = {
     divRefs: divRefsClone,
     divDisplay: [...this.state.divDisplay],
     selected: [...this.state.selected]
   };
   return history;
  }

  undo = () => {
    if (this.state.history.divRefs && !(_.isEqual(this.state.history.divRefs, this.state.divRefs))) {
      const stateClone = _.cloneDeep(this.state);
      // const stateClone = JSON.parse(JSON.stringify(this.state));
      const history = stateClone.history;
      console.log('undo', stateClone.divRefs, stateClone.history.divRefs);
      const redoState = {
        divRefs: stateClone.divRefs,
        divDisplay: stateClone.divDisplay,
        selected: stateClone.selected
      };
      this.setState({
        divRefs: history.divRefs,
        divDisplay: history.divDisplay,
        selected: history.selected,
        moving: false,
        mouseCoords: {
          x: 0,
          y: 0
        },
        redoState
      });
    }
  }

  redo = () => {
    if (this.state.redoState.divRefs) {
      const stateClone = _.cloneDeep(this.state);
      const redo = stateClone.redoState;
      this.setState({
        divRefs: redo.divRefs,
        divDisplay: redo.divDisplay,
        selected: redo.selected,
        moving: false,
        mouseCoords: {
          x: 0,
          y: 0
        },
        redoState: {}
      });
    }
  }

  addDiv = (style) => {
    const divDisplay = [...this.state.divDisplay];
    const divRefs = {...this.state.divRefs};
    const id = [uuid()];

    if (this.state.selected.length > 0) {
      this.state.selected.forEach((selection, i) => {
        const divInfo = {
          id: id[i],
          style: style,
          selected: false,
          childDivs: [],
          parent: selection,
          moveCoords: {
            X: 0,
            y: 0
          }
        };
        divRefs[id[i]] = divInfo;
        divRefs[selection].childDivs.push(id[i]);
        id.push(uuid());
      });
    } else {
      const divInfo = {
        id: id[0],
        style: style,
        selected: false,
        childDivs: [],
        parent: 0,
        moveCoords: {
          X: 0,
          y: 0
        }
      };
      divRefs[id[0]] = divInfo;
      divDisplay.push(id[0]);
    }
    const history = this.cloneState();
    this.setState({
      history,
      divDisplay,
      divRefs
    });
  }

  deleteChildren = (divRefs, id) => {
    if (divRefs[id].childDivs.length > 0) {
      divRefs[id].childDivs.forEach((divID) => {
        this.deleteChildren(divRefs, divID);
        delete divRefs[id];
      });
    } else {
      delete divRefs[id];
    }
  }

  deleteDiv = () => {
    const divRefs = {...this.state.divRefs};
    const divDisplay = [...this.state.divDisplay];
    this.state.selected.forEach((id) => {
      if (divRefs[id].parent === 0) {
        removeFromArray(id, divDisplay);
      } else if (divRefs[divRefs[id].parent] !== undefined) {
        removeFromArray(id, divRefs[divRefs[id].parent].childDivs);
      }
      this.deleteChildren(divRefs, id);
    });

    this.setState({
      history: this.cloneState(),
      selected: [],
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
    },
      () => {
        if (this.state.moving) {
          this.setState({
            history: this.cloneState()
          });
        }
      }
    );
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
    },
      () => {
        if (this.state.moving && this.state.selected.length > 0) {
          this.setState({
            history: this.cloneState()
          });
        }
      }
    );
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
        <Toolbar moving={this.state.moving} redo={this.redo} undo={this.undo} deleteDiv={this.deleteDiv} toggleMove={this.toggleMove} addDiv={this.addDiv} changeDivs={this.changeDivs} selected={this.state.selected.length > 0} unselectAll={this.unselectAll} />
        {
          this.state.divDisplay.map((id, index) => {
            const div = this.state.divRefs[id];
            return(
              <Div divRefs={this.state.divRefs} updateDims={this.updateDims} selected={div.selected} select={this.select} unselect={this.unselect} style={div.style} key={div.id} id={div.id} index={index} childDivs={div.childDivs} parent={div.parent} />
            );
          })
        }
      </div>
    );
  }
}

export default App;
