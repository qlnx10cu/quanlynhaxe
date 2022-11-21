import React from "react";
import { connect } from "react-redux";
import Loading from "../Loading";

const DivFragment = ({ isLoading, children }) => {
    return (
        <React.Fragment>
            <If condition={isLoading}>
                <Loading/>
            </If>
            <If condition={!isLoading}>
                {children}
            </If>
        </React.Fragment>
    );
};

const mapState = (state) => ({
    isLoading: state.App.isLoading,
});
export default connect(mapState, null)(DivFragment);
