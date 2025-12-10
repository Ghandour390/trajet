import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as maintenanceAPI from '../../api/maintenance';

// Async Thunks
export const getMaintenanceRecords = createAsyncThunk(
  'maintenance/getMaintenanceRecords',
  async (params, { rejectWithValue }) => {
    try {
      const response = await maintenanceAPI.getMaintenanceRecords(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des maintenances');
    }
  }
);

export const getMaintenanceById = createAsyncThunk(
  'maintenance/getMaintenanceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await maintenanceAPI.getMaintenanceById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement');
    }
  }
);

export const getMaintenanceByVehicle = createAsyncThunk(
  'maintenance/getMaintenanceByVehicle',
  async (vehicleId, { rejectWithValue }) => {
    try {
      const response = await maintenanceAPI.getMaintenanceByVehicle(vehicleId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement');
    }
  }
);

export const createMaintenance = createAsyncThunk(
  'maintenance/createMaintenance',
  async (maintenanceData, { rejectWithValue }) => {
    try {
      const response = await maintenanceAPI.createMaintenance(maintenanceData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création');
    }
  }
);

export const updateMaintenance = createAsyncThunk(
  'maintenance/updateMaintenance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await maintenanceAPI.updateMaintenance(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

export const deleteMaintenance = createAsyncThunk(
  'maintenance/deleteMaintenance',
  async (id, { rejectWithValue }) => {
    try {
      await maintenanceAPI.deleteMaintenance(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression');
    }
  }
);

// Initial state
const initialState = {
  records: [],
  vehicleMaintenance: [],
  currentMaintenance: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// Slice
const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMaintenance: (state) => {
      state.currentMaintenance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Maintenance Records
      .addCase(getMaintenanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaintenanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records || action.payload;
        state.totalCount = action.payload.totalCount || action.payload.length;
      })
      .addCase(getMaintenanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Maintenance By Id
      .addCase(getMaintenanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaintenanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMaintenance = action.payload;
      })
      .addCase(getMaintenanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Maintenance By Vehicle
      .addCase(getMaintenanceByVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleMaintenance = action.payload;
      })
      // Create Maintenance
      .addCase(createMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(createMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Maintenance
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
        state.currentMaintenance = action.payload;
      })
      // Delete Maintenance
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(r => r._id !== action.payload);
      });
  },
});

// Selectors
export const selectMaintenanceRecords = (state) => state.maintenance.records;
export const selectVehicleMaintenance = (state) => state.maintenance.vehicleMaintenance;
export const selectCurrentMaintenance = (state) => state.maintenance.currentMaintenance;
export const selectMaintenanceLoading = (state) => state.maintenance.loading;
export const selectMaintenanceError = (state) => state.maintenance.error;
export const selectMaintenanceTotalCount = (state) => state.maintenance.totalCount;

export const { clearError, clearCurrentMaintenance } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
