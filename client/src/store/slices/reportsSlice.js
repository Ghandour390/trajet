import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reportsAPI from '../../api/reports';

export const getReportStats = createAsyncThunk(
  'reports/getStats',
  async (period, { rejectWithValue }) => {
    try {
      return await reportsAPI.getReportStats(period);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des statistiques');
    }
  }
);

export const getFuelChartData = createAsyncThunk(
  'reports/getFuelChart',
  async (period, { rejectWithValue }) => {
    try {
      return await reportsAPI.getFuelChartData(period);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des données carburant');
    }
  }
);

export const getKilometrageChartData = createAsyncThunk(
  'reports/getKilometrageChart',
  async (period, { rejectWithValue }) => {
    try {
      return await reportsAPI.getKilometrageChartData(period);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des données kilométrage');
    }
  }
);

const initialState = {
  stats: {
    totalDistance: 0,
    totalFuel: 0,
    totalCost: 0,
    avgConsumption: 0,
    totalTrips: 0
  },
  fuelChartData: [],
  kilometrageChartData: [],
  loading: false,
  error: null
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReportStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReportStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getReportStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFuelChartData.fulfilled, (state, action) => {
        state.fuelChartData = action.payload;
      })
      .addCase(getKilometrageChartData.fulfilled, (state, action) => {
        state.kilometrageChartData = action.payload;
      });
  }
});

export const selectReportStats = (state) => state.reports.stats;
export const selectFuelChartData = (state) => state.reports.fuelChartData;
export const selectKilometrageChartData = (state) => state.reports.kilometrageChartData;
export const selectReportsLoading = (state) => state.reports.loading;

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;
