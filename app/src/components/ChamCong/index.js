import React, { useState } from "react";
import RenderChamCong from "./ChamCong";
import TheoDoi from "./TheoDoi";
import { Tab, TabContent } from "../../styles";

const ChamCong = () => {
    let [activePage, setActive] = useState(1);

    return (
        <div>
            <Tab>
                <button className={activePage === 1 ? "active" : ""} onClick={() => setActive(1)}>
                    Chấm công
                </button>
                <button className={activePage === 2 ? "active" : ""} onClick={() => setActive(2)}>
                    Theo dõi
                </button>
            </Tab>

            <TabContent className={activePage === 1 ? "active" : ""}>
                <RenderChamCong />
            </TabContent>

            <TabContent className={activePage === 2 ? "active" : ""}>
                <TheoDoi />
            </TabContent>
        </div>
    );
};

export default ChamCong;
