import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as tripsAPI from '../../api/trips';

// Async Thunks
export const getTrips = createAsyncThunk(
  'trips/getTrips',
  async (params, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.getTrips(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des trajets');
    }
  }
);

export const getMyTrips = createAsyncThunk(
  'trips/getMyTrips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.getMyTrips();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement de vos trajets');
    }
  }
);

export const getTripById = createAsyncThunk(
  'trips/getTripById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.getTripById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement du trajet');
    }
  }
);

export const createTrip = createAsyncThunk(
  'trips/createTrip',
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.createTrip(tripData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création du trajet');
    }
  }
);

export const updateTrip = createAsyncThunk(
  'trips/updateTrip',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.updateTrip(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour du trajet');
    }
  }
);

export const updateTripStatus = createAsyncThunk(
  'trips/updateTripStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await tripsAPI.updateTripStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour du statut');
    }
  }
);

export const deleteTrip = createAsyncThunk(
  'trips/deleteTrip',
  async (id, { rejectWithValue }) => {
    try {
      await tripsAPI.deleteTrip(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression du trajet');
    }
  }
);

// Initial state
const initialState = {
  trips: [],
  myTrips: [],
  currentTrip: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// Slice
const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Trips
      .addCase(getTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload.trips || action.payload;
        state.totalCount = action.payload.totalCount || action.payload.length;
      })
      .addCase(getTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Trips
      .addCase(getMyTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.myTrips = action.payload.trips || action.payload;
      })
      .addCase(getMyTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Trip By Id
      .addCase(getTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrip = action.payload;
      })
      .addCase(getTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Trip
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.push(action.payload);
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Trip
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
        state.currentTrip = action.payload;
      })
      // Update Trip Status
      .addCase(updateTripStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
        const myIndex = state.myTrips.findIndex(t => t._id === action.payload._id);
        if (myIndex !== -1) {
          state.myTrips[myIndex] = action.payload;
        }
        state.currentTrip = action.payload;
      })
      // Delete Trip
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.filter(t => t._id !== action.payload);
      });
  },
});

// Selectors
export const selectTrips = (state) => state.trips.trips;
export const selectMyTrips = (state) => state.trips.myTrips;
export const selectCurrentTrip = (state) => state.trips.currentTrip;
export const selectTripsLoading = (state) => state.trips.loading;
export const selectTripsError = (state) => state.trips.error;
export const selectTripsTotalCount = (state) => state.trips.totalCount;

export const { clearError, clearCurrentTrip } = tripsSlice.actions;
export default tripsSlice.reducer;
