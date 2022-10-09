import React from "react";
import { connect } from "react-redux";

const LoadingWarrper = () => {
    return (
        <div className={"lds-wraper"}>
            <div className="lds-hourglass"></div>
        </div>
    );
};

export default connect(null, null)(LoadingWarrper);
