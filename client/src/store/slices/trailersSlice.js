import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as trailersAPI from '../../api/trailers';

// Async Thunks
export const getTrailers = createAsyncThunk(
  'trailers/getTrailers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await trailersAPI.getTrailers();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement des remorques');
    }
  }
);

export const getTrailerById = createAsyncThunk(
  'trailers/getTrailerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await trailersAPI.getTrailerById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de chargement de la remorque');
    }
  }
);

export const createTrailer = createAsyncThunk(
  'trailers/createTrailer',
  async (trailerData, { rejectWithValue }) => {
    try {
      const response = await trailersAPI.createTrailer(trailerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création de la remorque');
    }
  }
);

export const updateTrailer = createAsyncThunk(
  'trailers/updateTrailer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await trailersAPI.updateTrailer(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour de la remorque');
    }
  }
);

export const deleteTrailer = createAsyncThunk(
  'trailers/deleteTrailer',
  async (id, { rejectWithValue }) => {
    try {
      await trailersAPI.deleteTrailer(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression de la remorque');
    }
  }
);

// Initial state
const initialState = {
  trailers: [],
  currentTrailer: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// Slice
const trailersSlice = createSlice({
  name: 'trailers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTrailer: (state) => {
      state.currentTrailer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Trailers
      .addCase(getTrailers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrailers.fulfilled, (state, action) => {
        state.loading = false;
        state.trailers = action.payload.trailers || action.payload;
        state.totalCount = action.payload.totalCount || action.payload.length;
      })
      .addCase(getTrailers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Trailer By Id
      .addCase(getTrailerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrailerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrailer = action.payload;
      })
      .addCase(getTrailerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Trailer
      .addCase(createTrailer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrailer.fulfilled, (state, action) => {
        state.loading = false;
        state.trailers.push(action.payload);
      })
      .addCase(createTrailer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Trailer
      .addCase(updateTrailer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trailers.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.trailers[index] = action.payload;
        }
      })
      // Delete Trailer
      .addCase(deleteTrailer.fulfilled, (state, action) => {
        state.loading = false;
        state.trailers = state.trailers.filter(t => t._id !== action.payload);
      });
  },
});

// Selectors
export const selectTrailers = (state) => state.trailers.trailers;
export const selectCurrentTrailer = (state) => state.trailers.currentTrailer;
export const selectTrailersLoading = (state) => state.trailers.loading;
export const selectTrailersError = (state) => state.trailers.error;
export const selectTrailersTotalCount = (state) => state.trailers.totalCount;

export const { clearError, clearCurrentTrailer } = trailersSlice.actions;
export default trailersSlice.reducer;
