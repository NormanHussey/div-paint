import React, { Component } from 'react';

import DetailPanel from './DetailPanel';

class Details extends Component {

  render() {
    const id = this.props.selected;
    const div = this.props.divRefs[id];
    return(
      <div className="details">
        {
          id ?
            <DetailPanel key={'details' + id} style={this.props.divRefs[id].style} div={div} updateDiv={this.props.updateDiv} divRefs={this.props.divRefs} select={this.props.select}/>
            : null
        }
      </div>
    );
  }
}

export default Details;