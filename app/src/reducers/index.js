import { combineReducers } from "redux";
import Authenticate from "./Authenticate";
import Product from "./Product";
import AppInfo from "./AppInfo";
import Modal from "./Modal";
import App from "./App";

export default combineReducers({
    Authenticate,
    Product,
    Modal,
    AppInfo,
    App,
});
