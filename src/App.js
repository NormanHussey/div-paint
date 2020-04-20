import React, { Component } from 'react';
import './App.css';

import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import removeFromArray from './functions/removeFromArray';

import Div from './Components/Div';
import Toolbar from './Components/Toolbar';
import Details from './Components/Details';

class App extends Component {
  constructor() {
    super();
    this.boardRef = React.createRef();
    this.state = {
      divRefs: {},
      divDisplay: [],
      selected: '',
      moving: false,
      mouseCoords: {
        x: 0,
        y: 0
      },
      history: {},
      redoState: {},
      clipboard: [],
      mouseDown: false
    };
  }

  cloneState = () => {
   const divRefsClone = _.cloneDeep(this.state.divRefs);
  //  console.log('cloneState', divRefsClone);
   const history = {
     divRefs: divRefsClone,
     divDisplay: [...this.state.divDisplay],
     selected: this.state.selected
   };
   return history;
  }

  undo = () => {
    if (this.state.history.divRefs && !(_.isEqual(this.state.history.divRefs, this.state.divRefs))) {
      const stateClone = _.cloneDeep(this.state);
      const history = stateClone.history;
      // console.log('undo', stateClone.divRefs, stateClone.history.divRefs);
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
    const history = this.cloneState();
    const divDisplay = [...this.state.divDisplay];
    const divRefs = {...this.state.divRefs};
    const id = uuid();

    if (this.state.selected) {
      const selection = this.state.selected;
      const name = divRefs[selection].name + '-child' + (divRefs[selection].childDivs.length + 1);
      const divInfo = {
        id: id,
        name: name,
        style: style,
        selected: false,
        childDivs: [],
        parent: selection,
        moveCoords: {
          X: 0,
          y: 0
        }
      };
      divRefs[id] = divInfo;
      divRefs[selection].childDivs.push(id);
    } else {
      const name = 'div' + (divDisplay.length + 1);
      const divInfo = {
        id: id,
        name: name,
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
      divDisplay.push(id);
    }
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
    const history = this.cloneState();
    const divRefs = {...this.state.divRefs};
    const divDisplay = [...this.state.divDisplay];
    const id = this.state.selected;

    if (divRefs[id].parent === 0) {
      removeFromArray(id, divDisplay);
    } else if (divRefs[divRefs[id].parent] !== undefined) {
      removeFromArray(id, divRefs[divRefs[id].parent].childDivs);
    }
    this.deleteChildren(divRefs, id);

    this.setState({
      history,
      selected: '',
      divDisplay,
      divRefs
    });
  }

  copyChildren = (clipboard, divRefs, id) => {
    if (divRefs[id].childDivs.length > 0) {
      divRefs[id].childDivs.forEach((divID) => {
        this.copyChildren(clipboard, divRefs, divID);
        clipboard.push(divRefs[id]);
      });
    } else {
      clipboard.push(divRefs[id]);
    }
  }

  copyDiv = () => {
    if (this.state.selected) {
      const clipboard = [];
      const divRefs = _.cloneDeep(this.state.divRefs);
      this.copyChildren(clipboard, divRefs, this.state.selected);
      clipboard.reverse();
      this.setState({
        clipboard
      });
    }
  }

  cutDiv = () => {
    this.copyDiv();
    this.deleteDiv();
  }

  pasteDiv = () => {
    if (this.state.clipboard.length > 0) {
      const history = this.cloneState();
      const divDisplay = [...this.state.divDisplay];
      const divRefs = _.cloneDeep(this.state.divRefs);
      const id = [uuid()];

      const families = {};
      this.state.clipboard.forEach((div, index) => {
        families[div.id] = {
          oldId: div.id,
          newId: id[index],
          oldParent: div.parent,
          newParent: div.parent,
          kids: []
        };
        id.push(uuid());
      });

      const familyIds = Object.keys(families);
      familyIds.forEach((id) => {
        if (families[id].oldParent !== 0 && families[families[id].oldParent] !== undefined) {
          console.log(id);
          families[families[id].oldParent].kids.push(families[id].newId);
          families[id].newParent = families[families[id].oldParent].newId;
        } else if (families[families[id].oldParent] === undefined) {
          families[id].newParent = 0;
        }
      });

      const clipboard = this.state.clipboard;

      if (!this.state.selected) {
        clipboard.forEach((div, index) => {
          const family = families[div.id];
          const newId = family.newId;
          const divInfo = {
            id: newId,
            style: div.style,
            selected: false,
            childDivs: family.kids,
            parent: family.newParent,
            moveCoords: {
              X: 0,
              y: 0
            }
          };
          divRefs[newId] = divInfo;
          if (divInfo.parent === 0) {
            divDisplay.push(newId);
            divRefs[newId].name = 'div' + (divDisplay.length);
          } else {
            divRefs[newId].name = divRefs[divInfo.parent].name + '-child' + (divRefs[divInfo.parent].childDivs.length);
          }
        });
      } else { 
        const newlyCreated = [];

        const selection = this.state.selected;
        const i = 0;
 
        const newFamilies = _.cloneDeep(families);
        const newFamilyIds = Object.keys(newFamilies);
        newFamilyIds.forEach((id) => {
          newFamilies[id].newId = i + newFamilies[id].newId;
          const newKids = newFamilies[id].kids.map((kid) => {
            return i + kid;
          });
          newFamilies[id].kids = newKids;
          if (newFamilies[id].newParent !== 0) {
            newFamilies[id].newParent = i + newFamilies[id].newParent;
          }
        });

        // console.log(newFamilies);

        clipboard.forEach((div, index) => {
          const family = newFamilies[div.id];
          const newId = family.newId;
          let newParent;
          if (family.newParent === 0) {
            newParent = selection;
          } else {
            newParent = family.newParent;
          }
          const divInfo = {
            id: newId,
            style: div.style,
            selected: false,
            childDivs: family.kids,
            parent: newParent,
            moveCoords: {
              X: 0,
              y: 0
            }
          };

          divRefs[newId] = divInfo;
          newlyCreated.push(divInfo.id);

        });


        newlyCreated.forEach((id) => {
          const newDiv = divRefs[id];
          if (divRefs[newDiv.parent] !== undefined) {
            const childDivs = divRefs[newDiv.parent].childDivs;
            if (!childDivs.includes(id)) {
              divRefs[newDiv.parent].childDivs.push(id);
            }
            const name = divRefs[newDiv.parent].name + '-child' + (divRefs[newDiv.parent].childDivs.length);
            newDiv.name = name;
          }
        });
      }
  
      this.setState({
        history,
        divDisplay,
        divRefs
      });
    }
  }

  updateDiv = (id, style, name) => {
    const divRefs = {...this.state.divRefs};
    divRefs[id].style = style;
    divRefs[id].name = name;
    this.setState({
      divRefs
    });
  }

  select = (id, moveCoords = {}, dims = {}) => {
    // const selected = this.state.selected;
    const divRefs = {...this.state.divRefs};
    if (this.state.selected) {
      divRefs[this.state.selected].selected = false;
    }
    divRefs[id].selected = true;
    if (moveCoords !== {}) {
      divRefs[id].moveCoords = moveCoords;
    }
    if (dims !== {}) {
      divRefs[id].width = dims.width;
      divRefs[id].height = dims.height;
    }
    // selected.push(id);

    this.setState({
      selected: id,
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

  unselect = () => {
    if (this.state.selected) {
      const divRefs = {...this.state.divRefs};
      divRefs[this.state.selected].selected = false;
  
      this.setState({
        selected: '',
        divRefs
      });
    }
  }

  unselectAll = () => {
    // const divRefs = {...this.state.divRefs};
    // this.state.selected.forEach((id) => {
    //   divRefs[id].selected = false;
    // });

    this.setState({
      selected: ''
    });
  }

  toggleMove = () => {
    this.setState({
      moving: !this.state.moving
    },
      () => {
        if (this.state.moving && this.state.selected) {
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
    if (this.state.moving && this.state.selected) {
        const id = this.state.selected;
        // let newSelected = [id];
        // if (this.state.selected.length > 1) {
        //   newSelected = this.state.selected.filter((selectionId) => {
        //     if (selectionId === id) {
        //       return true;
        //     } else {
        //       divRefs[selectionId].selected = false;
        //       return false;
        //     }
        //   });
        // }
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
        style.top = +(((mouseCoords.y - selection.moveCoords.y) / height) * 100).toFixed(3) + '%';
        style.left = +(((mouseCoords.x - selection.moveCoords.x) / width) * 100).toFixed(3) + '%';
        selection.style = style;
        divRefs[id] = selection;
      
      this.setState({
        divRefs
      });
    }
  }

  render() {
    return (
      <div className="app">

        <Toolbar divRefs={this.state.divRefs} cutDiv={this.cutDiv} copyDiv={this.copyDiv} pasteDiv={this.pasteDiv} moving={this.state.moving} redo={this.redo} undo={this.undo} deleteDiv={this.deleteDiv} toggleMove={this.toggleMove} addDiv={this.addDiv} changeDivs={this.changeDivs} selected={this.state.selected} unselect={this.unselect} />

        <div ref={this.boardRef} className="mainContainer" onMouseDown={()=> this.setState({mouseDown: true})} onMouseUp={()=> this.setState({mouseDown: false})} onMouseMove={ (e) => {
            if (this.state.moving) {
              this.handleMouseMove(e);
            }
          }
        }>
          {
            this.state.divDisplay.map((id, index) => {
              const div = this.state.divRefs[id];
              return(
                <Div divRefs={this.state.divRefs} updateDims={this.updateDims} selected={div.selected} select={this.select} unselect={this.unselect} style={div.style} key={div.id} id={div.id} index={index} childDivs={div.childDivs} parent={div.parent} />
              );
            })
          }
        </div>

        <Details updateDiv={this.updateDiv} selected={this.state.selected} divRefs={this.state.divRefs} select={this.select} />
      </div>
    );
  }
}

export default App;
