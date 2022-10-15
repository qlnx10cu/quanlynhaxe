import { HOST, HOST_SHEME } from "../Config";
import ApiObject from "./ApiObject";
import APIUtils from "./APIUtils";

class StatisticApi extends ApiObject {
    constructor(name) {
        super(name);
    }

    getBillByDate = (start, end) => {
        return APIUtils.get(`/statistic/bill?end=${end}&start=${start}&trangthai=1`);
    };

    exportBill(start, end) {
        window.open(`${HOST}/statistic/bill/export?start=${start}&end=${end}&trangthai=1`, "_blank");
    }

    exportThongKe(start, end) {
        window.open(`${HOST_SHEME}/exportthongke?start=${start}&end=${end}`, "_blank");
    }

    exportBillEmployee(start, end) {
        window.open(`${HOST}/statistic/bill/employee/export?start=${start}&end=${end}&trangthai=1`, "_blank");
    }
}

export default new StatisticApi("/statistic");
