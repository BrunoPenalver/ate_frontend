import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { Order } from '../interfaces/orders';

interface OrdersState {
    loading: boolean;
    orders: Order[];
    error: string | null;
}

const initialState: OrdersState = {
    loading: false,
    orders: [],
    error: null,
};

// Async thunk para obtener órdenes
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (filters: string = '', { rejectWithValue }) => {
        try {
            const response = await api.get('/orders' + filters);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default ordersSlice.reducer;