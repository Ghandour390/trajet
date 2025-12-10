import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as fuelAPI from '../../api/fuel';

// Async Thunks
export const getFuelRecords = createAsyncThunk(
  'fuel/getFuelRecords',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fuelAPI.getFuelRecords(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des enregistrements de carburant');
    }
  }
);

export const getFuelByTripId = createAsyncThunk(
  'fuel/getFuelByTripId',
  async (tripId, { rejectWithValue }) => {
    try {
      const response = await fuelAPI.getFuelByTripId(tripId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement');
    }
  }
);

export const createFuelRecord = createAsyncThunk(
  'fuel/createFuelRecord',
  async (fuelData, { rejectWithValue }) => {
    try {
      const response = await fuelAPI.createFuelRecord(fuelData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création');
    }
  }
);

export const updateFuelRecord = createAsyncThunk(
  'fuel/updateFuelRecord',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fuelAPI.updateFuelRecord(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

export const deleteFuelRecord = createAsyncThunk(
  'fuel/deleteFuelRecord',
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
  'fuel/getFuelStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fuelAPI.getFuelStats(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des statistiques');
    }
  }
);

// Initial state
const initialState = {
  records: [],
  tripFuel: [],
  stats: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// Slice
const fuelSlice = createSlice({
  name: 'fuel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTripFuel: (state) => {
      state.tripFuel = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Fuel Records
      .addCase(getFuelRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFuelRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records || action.payload;
        state.totalCount = action.payload.totalCount || action.payload.length;
      })
      .addCase(getFuelRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Fuel By Trip Id
      .addCase(getFuelByTripId.fulfilled, (state, action) => {
        state.loading = false;
        state.tripFuel = action.payload;
      })
      // Create Fuel Record
      .addCase(createFuelRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFuelRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(createFuelRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Fuel Record
      .addCase(updateFuelRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      // Delete Fuel Record
      .addCase(deleteFuelRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(r => r._id !== action.payload);
      })
      // Get Fuel Stats
      .addCase(getFuelStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFuelStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getFuelStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectFuelRecords = (state) => state.fuel.records;
export const selectTripFuel = (state) => state.fuel.tripFuel;
export const selectFuelStats = (state) => state.fuel.stats;
export const selectFuelLoading = (state) => state.fuel.loading;
export const selectFuelError = (state) => state.fuel.error;

export const { clearError, clearTripFuel } = fuelSlice.actions;
export default fuelSlice.reducer;
