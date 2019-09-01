import React, {Component} from "react";

import "./Backdrop.css";

interface BackdropProps {
    onClickHandler: () => void
}
class Backdrop extends Component<BackdropProps, {}> {

    render() {
        return(
            <div className="backdrop" onClick={this.props.onClickHandler}></div>
        );
    }
}
export default Backdrop;