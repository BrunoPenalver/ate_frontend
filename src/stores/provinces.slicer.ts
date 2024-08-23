import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { Province } from '../models/province';


interface ProvincesState {
  provinces: Province[];
  provinceOptions: { value: number; label: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: ProvincesState = {
  provinces: [],
  provinceOptions: [],
  loading: false,
  error: null,
};

export const fetchProvinces = createAsyncThunk(
  'provinces/fetchProvinces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/provinces');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProvinceOptions = createAsyncThunk(
  'provinces/fetchProvinceOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/provinces/options');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createProvince = createAsyncThunk(
  'provinces/createProvince',
  async (provinceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/provinces', provinceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const provincesSlice = createSlice({
  name: 'provinces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.provinces = action.payload;
        state.loading = false;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProvinceOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinceOptions.fulfilled, (state, action) => {
        state.provinceOptions = action.payload;
        state.loading = false;
      })
      .addCase(fetchProvinceOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProvince.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProvince.fulfilled, (state, action) => {
        state.provinces.push(action.payload);
        state.loading = false;
      })
      .addCase(createProvince.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default provincesSlice.reducer;
