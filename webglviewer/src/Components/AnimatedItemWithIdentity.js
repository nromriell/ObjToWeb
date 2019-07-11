import React from 'react'

const AnimatedItemWithIdentity = () => {
    return (
        <div className="animateditemwithidentity" style={{position:"fixed", right:this.props.right, bottom:this.props.bottom, width:this.props.size, height:this.props.size}}>
            {this.props.id}
        </div>
    );
};

export default AnimatedItemWithIdentity;