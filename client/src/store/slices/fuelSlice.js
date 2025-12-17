import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as fuelAPI from '../../api/fuel';

export const getFuelRecords = createAsyncThunk(
  'fuel/getRecords',
  async (filters, { rejectWithValue }) => {
    try {
      return await fuelAPI.getFuelRecords(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement');
    }
  }
);

export const createFuelRecord = createAsyncThunk(
  'fuel/create',
  async (fuelData, { rejectWithValue }) => {
    try {
      return await fuelAPI.createFuelRecord(fuelData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création');
    }
  }
);

export const deleteFuelRecord = createAsyncThunk(
  'fuel/delete',
  async (id, { rejectWithValue }) => {
    try {
      await fuelAPI.deleteFuelRecord(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression');
    }
  }
);

export const getFuelStats = createAsyncThunk(
  'fuel/getStats',
  async (params, { rejectWithValue }) => {
    try {
      return await fuelAPI.getFuelStats(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des statistiques');
    }
  }
);

const initialState = {
  records: [],
  stats: null,
  loading: false,
  error: null
};

const fuelSlice = createSlice({
  name: 'fuel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFuelRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFuelRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(getFuelRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFuelRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFuelRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(createFuelRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFuelRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(r => r._id !== action.payload);
      })
      .addCase(getFuelStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  }
});

export const selectFuelRecords = (state) => state.fuel.records;
export const selectFuelStats = (state) => state.fuel.stats;
export const selectFuelLoading = (state) => state.fuel.loading;

export const { clearError } = fuelSlice.actions;
export default fuelSlice.reducer;
