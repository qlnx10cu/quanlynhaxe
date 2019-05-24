import React, {useState} from 'react';
import styled from 'styled-components';
import RenderChamCong from './ChamCong'
import TheoDoi from './TheoDoi'

const Tab = styled.div`
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        
        button {
            background-color: inherit;
            float: left;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 14px 16px;
            transition: 0.3s;
            font-size: 17px;
            
            :hover {
                background-color: #ddd;
            }
            
            &.active {
                background-color: #ccc;
            }
        }
`;

const TabContent = styled.div`
       display: none;
       
       &.active {
        display: block;
       }
`;

const ChamCong = () => {

    let [activePage,setActive] = useState(1);

    return (
        <div>
            <Tab>
                <button className={activePage === 1 ? "active" : ""} onClick={() => setActive(1)}>Chấm công</button>
                <button className={activePage === 2 ? "active" : ""} onClick={() => setActive(2)}>Theo dõi</button>
            </Tab>

            <TabContent className={activePage === 1 ? "active" : ""}>
                <RenderChamCong/>
            </TabContent>

            <TabContent className={activePage === 2 ? "active" : ""}>
                <TheoDoi/>
            </TabContent>

        </div>
    )
};

export default ChamCong;