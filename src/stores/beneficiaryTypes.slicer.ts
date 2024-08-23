import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { BeneficiaryType } from '../interfaces/orders/beneficiary';


interface BeneficiaryTypesState {
  beneficiaryTypes: BeneficiaryType[];
  options: { value: number, label: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: BeneficiaryTypesState = {
  beneficiaryTypes: [],
  options: [],
  loading: false,
  error: null,
};

export const fetchBeneficiaryTypes = createAsyncThunk(
  'beneficiaryTypes/fetchBeneficiaryTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/beneficiaryTypes');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBeneficiaryTypeOptions = createAsyncThunk(
  'beneficiaryTypes/fetchBeneficiaryTypeOptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/beneficiaryTypes/options');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const beneficiaryTypesSlice = createSlice({
  name: 'beneficiaryTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeneficiaryTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeneficiaryTypes.fulfilled, (state, action) => {
        state.beneficiaryTypes = action.payload;
        state.loading = false;
      })
      .addCase(fetchBeneficiaryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBeneficiaryTypeOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeneficiaryTypeOptions.fulfilled, (state, action) => {
        state.options = action.payload;
        state.loading = false;
      })
      .addCase(fetchBeneficiaryTypeOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default beneficiaryTypesSlice.reducer;
