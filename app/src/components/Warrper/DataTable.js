import React, { useEffect, useState } from 'react';
import { Table, DivFlexRow, Input, Button, Select } from '../../styles';
import _ from 'lodash';

const DataTable = (props) => {

    const [rows, setRows] = useState([]);
    let [search, setSearch] = useState("");
    let [maxSizePage, setMaxSizePage] = useState(10);
    let [maxPage, setMaxPage] = useState(0);
    let [page, setPage] = useState(0);

    const data = props.data || [];

    useEffect(() => {
        tachList(data, maxSizePage);
    }, [data]);

    const handleNextPage = () => {
        let newPage = page + 1;
        if (newPage >= maxPage) {
            return;
        }
        setPage(newPage);
    };

    const handlePrevPage = () => {
        let newPage = page - 1;
        if (newPage < 0) {
            return;
        }
        setPage(newPage);
    };

    const handleStartPage = () => {
        if (page <= 0) {
            return;
        }
        setPage(0);
    };

    const handleEndPage = () => {
        if (page >= maxPage) {
            return;
        }
        setPage(maxPage - 1);
    };


    const tachList = (list, size) => {
        list = list || [];
        if (props.searchData) {
            list = list.filter(e => e && props.searchData(search, e, list));
        }
        let tmp = _.chunk(list, size);

        setRows(tmp);
        setMaxPage(tmp.length);
        setPage(0);
        if (props.setData) {
            props.setData(tmp[0]);
        }
    };

    const handleChangeSoHang = (e) => {
        setMaxSizePage(parseInt(e));
        tachList(data, e);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            tachList(data, maxSizePage);
        }
    }

    const maxPageEnd = (page + 1) * maxSizePage;
    return (
        <>
            <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
                {props.searchData &&
                    <DivFlexRow style={{ alignItems: 'center' }}>
                        <label style={{ marginLeft: 10 }}>Search: </label>
                        <Input type="text" onKeyPress={handleKeyPress} value={search} style={{ marginLeft: 10 }} onChange={(e) => setSearch(e.target.value)} />
                        <Button style={{ marginLeft: 10 }} onClick={handleKeyPress}>Tìm kếm </Button>
                    </DivFlexRow>
                }
                {!props.searchData &&
                    <DivFlexRow />
                }
                <DivFlexRow style={{ alignItems: ' center', justifyContent: 'flex-end', marginTop: 5, marginBottom: 10 }}>
                    <label>Số hàng </label>
                    <Select style={{ marginLeft: 10 }} width={100} value={maxSizePage} onChange={(e) => handleChangeSoHang(e.target.value)} >
                        <option value="10" >10</option>
                        <option value="25" >25</option>
                        <option value="50" >50</option>
                        <option value="100" >100</option>
                        <option value="250" >250</option>
                        <option value="500" >500</option>
                        <option value="1000" >1000</option>
                        <option value="2000" >2000</option>
                    </Select>
                    <Button style={{ marginLeft: 35 }} onClick={handlePrevPage}><i className="fas fa-angle-left"></i></Button>
                    <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 }}>
                        <div> {page + 1}/{maxPage > 1 ? maxPage : 1}</div>
                    </DivFlexRow>
                    <Button style={{ marginLeft: 15 }} onClick={handleNextPage}><i className="fas fa-angle-right"></i></Button>
                </DivFlexRow>
            </DivFlexRow>
            <Table >
                {props.children[0]}
                {React.cloneElement(props.children[1], { rows: rows[page] || [], page, maxSizePage })}
            </Table>
            <DivFlexRow style={{ justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
                <DivFlexRow style={{ alignItems: 'center' }}>
                    {data.length != 0 &&
                        <label style={{ marginLeft: 10 }}>Show {page * maxSizePage + 1} - {maxPageEnd < data.length ? maxPageEnd : data.length} / {data.length} </label>
                    }
                </DivFlexRow>
                <DivFlexRow style={{ alignItems: 'center', justifyContent: 'flex-end', marginTop: 5, marginBottom: 5 }}>
                    <Button onClick={handleStartPage}><i className="fas fa-angle-double-left"></i></Button>
                    <Button style={{ marginLeft: 15 }} onClick={handlePrevPage}><i className="fas fa-angle-left"></i></Button>
                    <DivFlexRow style={{ alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 }}>
                        <div> {page + 1}/{maxPage > 1 ? maxPage : 1}</div>
                    </DivFlexRow>
                    <Button style={{ marginLeft: 15 }} onClick={handleNextPage}><i className="fas fa-angle-right"></i></Button>
                    <Button style={{ marginLeft: 15 }} onClick={handleEndPage}><i className="fas fa-angle-double-right"></i></Button>
                </DivFlexRow>
            </DivFlexRow>

        </>
    );
}

DataTable.Header = (props) => {
    return (<thead><tr {...props}>{props.children}</tr></thead>)
};

DataTable.Header.Column = (props) => {
    return (<th {...props}>{props.children}</th>)
}

DataTable.Body = (props) => {
    if (!props.rows || props.rows.length ==0) {
        return (
        <tbody>
            {<tr><td colspan="100%">{props.noData || 'Không có dữ liệu'}</td></tr>}
        </tbody>
        )
    }
    return (
        <tbody {...props}>
            {props.rows.map((item, index) => {
                if (React.isValidElement(props.children)) {
                    return React.cloneElement(props.children, { key: index, item, index: index + props.page * props.maxSizePage });
                }
                return props.children;
            })}
        </tbody>
    )
};

DataTable.Body.Row = (props) => {
    return (<tr {...props}>{props.children}</tr>)
};

DataTable.Body.Column = (props) => {
    return (<td {...props}>{props.children}</td>)
}



export default DataTable;
