import React, { Component } from 'react';

class Details extends Component {
  render() {
    return(
      <div className="details">
        {
        this.props.selected.map((id, index) => {
            const div = this.props.divRefs[id];
            const style = {
              zIndex: index + 1
            };
            return (
              <div key={'details' + id} className="panel" style={style}>
                  <p>Name: {div.name}</p>
                  <p>Top: {div.style.top}</p>
                  <p>Left: {div.style.left}</p>
                  <p>Width: {div.style.width}</p>
                  <p>Height: {div.style.height}</p>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Details;