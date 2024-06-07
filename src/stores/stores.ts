import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user.slicer";

export const stores = configureStore({
    reducer: {
        user: userReducer,
    },
});