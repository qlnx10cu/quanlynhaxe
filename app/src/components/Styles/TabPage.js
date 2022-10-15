import React, { useState } from "react";
import { Tab, TabContent } from "../../styles";

const TabPage = ({ children, onChange }) => {
    let [activePage, setActive] = useState(0);

    children = children || [];

    return (
        <React.Fragment>
            <Tab>
                {children.map((item, idx) => {
                    return (
                        <button
                            key={idx}
                            className={activePage === idx ? "active" : ""}
                            onClick={() => {
                                setActive(idx);
                                if (onChange) {
                                    onChange(idx);
                                }
                            }}
                        >
                            {item.props.title}
                        </button>
                    );
                })}
            </Tab>
            {children.map((item, idx) => {
                return (
                    <TabContent key={idx} className={activePage === idx ? "active" : ""}>
                        {item}
                    </TabContent>
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
