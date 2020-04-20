import React, { Component } from 'react';

import DetailPanel from './DetailPanel';

class Details extends Component {

  render() {
    return(
      <div className="details">
        {
        this.props.selected.map((id, index) => {
            const div = this.props.divRefs[id];
            return (
              <DetailPanel key={'details' + id} index={index} style={this.props.divRefs[id].style} div={div} updateDiv={this.props.updateDiv} divRefs={this.props.divRefs} select={this.props.select}/>
            );
          })
        }
      </div>
    );
  }
}

export default Details;