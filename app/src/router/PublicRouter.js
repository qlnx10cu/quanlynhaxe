import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PublicRouter = ({ component: Component, isAuthenticated, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                return !isAuthenticated ? <Component {...props} /> : <Redirect to="/products" />;
            }}
        />
    );
};

const mapState = (state) => ({
    isAuthenticated: state.Authenticate.isAuthenticated,
});

export default connect(mapState)(PublicRouter);
