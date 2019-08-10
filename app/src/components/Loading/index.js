import React from 'react'
import "./ldStyle.css"

const Loading = () => {
        return (
            <div className={"lds-wraper"}>
                <div className="lds-hourglass"></div>
            </div>
        )
}

export default Loading;