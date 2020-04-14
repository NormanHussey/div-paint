import React, { Component } from 'react';

class Details extends Component {
    render() {
        return(
            <div className="details">
                {
                    this.props.selected.map((id) => {
                        const div = this.props.divRefs[id];
                        return (
                            <div className="panel">
                                <p>Name: {div.name}</p>
                                <p>Top: {div.style.top}</p>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default Details;