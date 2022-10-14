import React, { useState } from "react";
import { Tab } from "../../styles";

const TabPage = ({ children }) => {
    let [activePage, setActive] = useState(0);

    children = children || [];

    return (
        <React.Fragment>
            <Tab>
                {children.map((item, idx) => {
                    return (
                        <button key={idx} className={activePage === idx ? "active" : ""} onClick={() => setActive(idx)}>
                            {item.props.title}
                        </button>
                    );
                })}
            </Tab>
            {children.map((item, idx) => {
                return (
                    <React.Fragment key={idx}>
                        <If condition={activePage == idx}>{item}</If>
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
};

/* eslint-disable react/display-name */

TabPage.Tab = ({ children }) => {
    return <React.Fragment>{children}</React.Fragment>;
};

/* eslint-enable react/display-name */

export default TabPage;
