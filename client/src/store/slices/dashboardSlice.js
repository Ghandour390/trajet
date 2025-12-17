import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardAPI from '../../api/dashboard';

export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardAPI.getDashboardStats();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des statistiques');
    }
  }
);

export const getRecentTrips = createAsyncThunk(
  'dashboard/getRecentTrips',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardAPI.getRecentTrips();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des trajets');
    }
  }
);

export const getVehiclesNeedingAttention = createAsyncThunk(
  'dashboard/getVehiclesAttention',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardAPI.getVehiclesNeedingAttention();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des véhicules');
    }
  }
);

export const getFuelChartData = createAsyncThunk(
  'dashboard/getFuelChart',
  async (period = 'month', { rejectWithValue }) => {
    try {
      return await dashboardAPI.getFuelChartData(period);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des données carburant');
    }
  }
);

export const getKilometrageChartData = createAsyncThunk(
  'dashboard/getKilometrageChart',
  async (period = 'month', { rejectWithValue }) => {
    try {
      return await dashboardAPI.getKilometrageChartData(period);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des données kilométrage');
    }
  }
);

const initialState = {
  stats: {
    totalVehicles: 0,
    totalTrailers: 0,
    activeTrips: 0,
    totalDrivers: 0,
    pendingMaintenance: 0
  },
  recentTrips: [],
  vehiclesAttention: [],
  fuelChartData: [],
  kilometrageChartData: [],
  loading: true,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRecentTrips.fulfilled, (state, action) => {
        state.recentTrips = action.payload;
      })
      .addCase(getVehiclesNeedingAttention.fulfilled, (state, action) => {
        state.vehiclesAttention = action.payload;
      })
      .addCase(getFuelChartData.fulfilled, (state, action) => {
        state.fuelChartData = action.payload;
      })
      .addCase(getKilometrageChartData.fulfilled, (state, action) => {
        state.kilometrageChartData = action.payload;
      });
  }
});

export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectRecentTrips = (state) => state.dashboard.recentTrips;
export const selectVehiclesAttention = (state) => state.dashboard.vehiclesAttention;
export const selectFuelChartData = (state) => state.dashboard.fuelChartData;
export const selectKilometrageChartData = (state) => state.dashboard.kilometrageChartData;
export const selectDashboardLoading = (state) => state.dashboard.loading;

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
