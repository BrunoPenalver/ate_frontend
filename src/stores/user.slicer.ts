import { createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";
import User from "../interfaces/user";

const getInitialUser = () =>
{
    const userString = localStorage.getItem("user");

    if(!userString)
        return { };

    return JSON.parse(userString)
}

const counterSlice = createSlice({
    name: 'user',
    initialState: 
    { 
        user: getInitialUser(),
    } as { user: User | null },
    reducers: 
    {
        setUser: (state, action) => 
        {
            const { user } = action.payload;

            localStorage.setItem("user", JSON.stringify(user));
            state.user = user;
        },
        logOut: () =>
        {
            api.put("/users/logout").then( () =>
            {
                document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                localStorage.removeItem("user");
                window.location.href = "/login";
            });
        },
        removeUser: (state) => 
        {
            localStorage.removeItem("user");
            state.user = null;
        }
    },
});

export const { setUser, removeUser, logOut } = counterSlice.actions;
export default counterSlice.reducer;