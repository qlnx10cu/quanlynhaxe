import { combineReducers } from "redux";
import Authenticate from "./Authenticate";
import Product from "./Product";
import AppInfo from "./AppInfo";
import Modal from "./Modal";
import Staff from "./StaffReducer";
import Salary from "./SalaryReducer";
import Customer from "./CustomerReducer";
import StoreOutside from "./StoreOutsideReducer";
import Repaired from "./RepairedReducer";
import Retail from "./RetailReducer";
import App from "./App";

export default combineReducers({
    Authenticate,
    Product,
    Modal,
    Staff,
    Salary,
    Customer,
    StoreOutside,
    Repaired,
    Retail,
    AppInfo,
    App,
});
