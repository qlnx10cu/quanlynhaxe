import React, { useEffect, useState } from "react";
import { Input } from "../../styles";

const InputList = ({
    style,
    className,
    name,
    list,
    data,
    autocomplete,
    limitList,
    id,
    readOnly,
    disabled,
    value,
    onChange,
    onEnter,
    searchData,
    render,
}) => {
    const [dataList, setDataList] = useState([]);
    const [idList, setIdList] = useState("");

    useEffect(() => {
        setIdList(list || String(Math.random()) + name);
    }, [list]);

    useEffect(() => {
        hanldeDataList();
    }, [data]);

    let arr = {};
    let properties = [];

    if (readOnly !== undefined) {
        properties.push(properties);
    }

    if (disabled !== undefined) {
        properties.push(disabled);
    }
    if (id !== undefined) {
        arr.id = id;
    }
    if (name !== undefined) {
        arr.name = name;
    }
    if (list !== undefined) {
        arr.list = list;
    }
    if (autocomplete !== undefined) {
        arr.autocomplete = autocomplete;
    }
    if (value !== undefined) {
        arr.value = value;
    }
    if (className !== undefined) {
        arr.className = className;
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onEnter(e);
        }
    };

    const hanldeDataList = () => {
        let dataFilter = data || [];
        if (searchData) {
            dataFilter = data.filter((item) => item && searchData(arr.value, item, data));
        }
        if (limitList) {
            dataFilter = dataFilter.slice(0, limitList);
        }
        setDataList(dataFilter);
    };

    const hanldeChange = (e) => {
        if (onChange) {
            onChange(e);
        }
        hanldeDataList();
    };

    return (
        <React.Fragment>
            <Input
                style={{ ...style }}
                {...arr}
                {...properties}
                list={idList}
                autocomplete="off"
                onChange={hanldeChange}
                onKeyPress={handleKeyPress}
            />
            <If condition={render}>
                <datalist id={idList}>{dataList.map((item, index) => render(item, index))}</datalist>
            </If>
        </React.Fragment>
    );
};

export default InputList;
