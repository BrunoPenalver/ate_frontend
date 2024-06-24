import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slicer";
import ordersReducer from "./orders.slice";

const rootReducer = combineReducers({
    orders: ordersReducer,
    user: userReducer,

});

export const stores = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof stores.getState>;
export type AppDispatch = typeof stores.dispatch;