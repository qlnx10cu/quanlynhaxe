import React from "react";
import { render } from "react-dom";
import App from "./App";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
import ReduxThunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./components/Loading";
import APIUtils from "./API/APIUtils";

// Config persist
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["Authenticate"],
    migrate: function (e, k) {
        return new Promise((resolve, reject) => {
            if (!e || !e.Authenticate || !e.Authenticate.isAuthenticated) {
                resolve({});
                return;
            }
            APIUtils.setToken(e.Authenticate.token);
            resolve(e);
        });
    },
};

const persistedReducer = persistReducer(persistConfig, reducers);

let store = createStore(persistedReducer, applyMiddleware(ReduxThunk));
let persistor = persistStore(store);
// Config persist

render(
    <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);
