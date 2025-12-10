import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as vehiclesAPI from '../../api/vehicles';

// Async Thunks
export const getVehicles = createAsyncThunk(
  'vehicles/getVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vehiclesAPI.getVehicles();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des véhicules');
    }
  }
);

export const getVehicleById = createAsyncThunk(
  'vehicles/getVehicleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vehiclesAPI.getVehicleById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement du véhicule');
    }
  }
);

export const createVehicle = createAsyncThunk(
  'vehicles/createVehicle',
  async (vehicleData, { rejectWithValue }) => {
    try {
      const response = await vehiclesAPI.createVehicle(vehicleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création du véhicule');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await vehiclesAPI.updateVehicle(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour du véhicule');
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id, { rejectWithValue }) => {
    try {
      await vehiclesAPI.deleteVehicle(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression du véhicule');
    }
  }
);

// Initial state
const initialState = {
  vehicles: [],
  currentVehicle: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// Slice
const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVehicle: (state) => {
      state.currentVehicle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Vehicles
      .addCase(getVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.vehicles || action.payload;
        state.totalCount = action.payload.totalCount || action.payload.length;
      })
      .addCase(getVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Vehicle By Id
      .addCase(getVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVehicle = action.payload;
      })
      .addCase(getVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Vehicle
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles.push(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Vehicle
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vehicles.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
      })
      // Delete Vehicle
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = state.vehicles.filter(v => v._id !== action.payload);
      });
  },
});

// Selectors
export const selectVehicles = (state) => state.vehicles.vehicles;
export const selectCurrentVehicle = (state) => state.vehicles.currentVehicle;
export const selectVehiclesLoading = (state) => state.vehicles.loading;
export const selectVehiclesError = (state) => state.vehicles.error;
export const selectVehiclesTotalCount = (state) => state.vehicles.totalCount;

export const { clearError, clearCurrentVehicle } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
