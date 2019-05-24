import {combineReducers} from 'redux'
import Authenticate from './Authenticate'
import Product from './Product'
import App from './App'


export default combineReducers({
    Authenticate,
    Product,
    App
})