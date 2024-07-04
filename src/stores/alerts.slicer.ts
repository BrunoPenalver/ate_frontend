import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertState {
    summary: string | null;
    detail: string | null;
    severity: 'success' | 'info' | 'warn' | 'error' | null;
}

const initialState: AlertState = {
    summary: null,
    detail: null,
    severity: null,
};

interface AlertPayload 
{
    summary: string;
    detail: string;
    severity: 'success' | 'info' | 'warn' | 'error';
}

const alertsSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        createAlert: (state, action: PayloadAction<AlertPayload>) => 
        {
            state.summary = action.payload.summary;
            state.detail = action.payload.detail;
            state.severity = action.payload.severity;
        },
        clearAlert: (state) => {
            state.summary = null;
            state.detail = null;
            state.severity = null;
        }
    },
});

export const { createAlert, clearAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
