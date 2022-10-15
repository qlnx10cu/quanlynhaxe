import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import lib from "../../lib";
import ModalWrapper from "../Warrper/ModalWrapper";
import RenderBillLe from "../ThongKe/RenderBillLe";
import RenderBillChan from "../ThongKe/RenderBillChan";
import RenderChiTietNhanVien from "../ThongKe/RenderChiTietNhanVien";
import BillSuaChuaAPI from "../../API/BillSuaChuaAPI";
import BillLeApi from "../../API/BillLeApi";

const PopupBill = (props) => {
    const useIsMounted = lib.useIsMounted();
    const [data, setData] = useState(null);
    const item = props.item;

    useEffect(() => {
        if (!item) return;
        getBill(item.mahoadon, item.loaihoadon)
            .then((res) => {
                if (!useIsMounted()) return;
                setData(res);
            })
            .catch((err) => {
                if (!useIsMounted()) return;
                props.alert("Không lấy được chi tiết bill");
            });
    }, []);

    const getBill = (mahoadon, loaihoadon) => {
        if (loaihoadon == 1) {
            return BillLeApi.getChitiet(mahoadon);
        }
        return BillSuaChuaAPI.getChitiet(mahoadon);
    };

    return (
        <ModalWrapper open={props.open} title={""} callback={props.callback} onClose={props.onClose}>
            <h3 style={{ textAlign: "center" }}>HEAD TRUNG TRANG</h3>
            <h4 style={{ textAlign: "center" }}>612/31B Trần Hưng Đạo, phường Bình Khánh, TP Long Xuyên, An Giang</h4>
            <h5 style={{ textAlign: "center" }}> Bán hàng: 02963 603 828 - Phụ tùng: 02963 603 826 - Dịch vụ: 02963 957 669</h5>
            <RenderChiTietNhanVien staff={props.staffs.find((e) => data && e.ma == data.manv)} />
            <h3 style={{ marginTop: 10 }}>Thông tin bill</h3>
            <Choose>
                <When condition={data && data.loaihoadon == 1}>
                    <RenderBillLe data={data} />
                </When>
                <When condition={data && data.loaihoadon == 0}>
                    <RenderBillChan data={data} />
                </When>
                <Otherwise>
                    <h3 style={{ textAlign: "center" }}>Không lấy được chi tiết bill</h3>
                </Otherwise>
            </Choose>
        </ModalWrapper>
    );
};

const mapState = (state) => ({
    staffs: state.Staff.data,
});

export default connect(mapState, null)(PopupBill);
