import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slicer";
import ordersReducer from "./orders.slice";
import alertsReducer from "./alerts.slicer";

const rootReducer = combineReducers({
    orders: ordersReducer,
    user: userReducer,
    alerts: alertsReducer,
});

export const stores = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof stores.getState>;
export type AppDispatch = typeof stores.dispatch;