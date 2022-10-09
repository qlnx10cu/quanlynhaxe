import React, { Suspense } from "react";
import styled from "styled-components";
const AlertWarrper = React.lazy(() => import("./Warrper/AlertWarrper"));
const ConfirmWarrper = React.lazy(() => import("./Warrper/ConfirmWarrper"));

const Wrapper = styled.div`
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
`;

/* eslint-disable react/display-name */

export default (Component, paramProps, paramExtend) => {
    return (props) => (
        <Suspense fallback={<Wrapper>Đang tải..</Wrapper>}>
            <Component {...props} {...paramProps} {...paramExtend} />
            <ConfirmWarrper></ConfirmWarrper>
            <AlertWarrper></AlertWarrper>
        </Suspense>
    );
};

/* eslint-enable react/display-name */
