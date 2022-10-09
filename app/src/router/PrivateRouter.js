import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRouter = ({ component: Component, isAuthenticated = true, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
};

const mapState = (state) => ({
    isAuthenticated: state.Authenticate.isAuthenticated,
});

export default connect(mapState)(PrivateRouter);
