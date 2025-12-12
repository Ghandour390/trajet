// Mock API
jest.mock('../api/trips', () => ({
  getTrips: jest.fn(),
  createTrip: jest.fn(),
  updateTrip: jest.fn(),
  deleteTrip: jest.fn()
}));

import tripsReducer, {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  selectTrips,
  selectTripsLoading
} from '../store/slices/tripsSlice';

describe('tripsSlice', () => {
  const initialState = {
    trips: [],
    myTrips: [],
    currentTrip: null,
    loading: false,
    error: null,
    totalCount: 0
  };

  it('should return initial state', () => {
    expect(tripsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getTrips', () => {
    it('should set loading true on pending', () => {
      const action = { type: getTrips.pending.type };
      const state = tripsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set trips on fulfilled', () => {
      const trips = [{ _id: '1', reference: 'TRIP001' }];
      const action = { type: getTrips.fulfilled.type, payload: trips };
      const state = tripsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.trips).toEqual(trips);
    });

    it('should set error on rejected', () => {
      const error = 'Failed to fetch';
      const action = { type: getTrips.rejected.type, payload: error };
      const state = tripsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('createTrip', () => {
    it('should add trip on fulfilled', () => {
      const newTrip = { _id: '2', reference: 'TRIP002' };
      const action = { type: createTrip.fulfilled.type, payload: newTrip };
      const state = tripsReducer(initialState, action);
      expect(state.trips).toContainEqual(newTrip);
      expect(state.loading).toBe(false);
    });
  });

  describe('updateTrip', () => {
    it('should update trip on fulfilled', () => {
      const existingState = {
        ...initialState,
        trips: [{ _id: '1', reference: 'TRIP001', status: 'planned' }]
      };
      const updatedTrip = { _id: '1', reference: 'TRIP001', status: 'in_progress' };
      const action = { type: updateTrip.fulfilled.type, payload: updatedTrip };
      const state = tripsReducer(existingState, action);
      expect(state.trips[0].status).toBe('in_progress');
    });
  });

  describe('deleteTrip', () => {
    it('should remove trip on fulfilled', () => {
      const existingState = {
        ...initialState,
        trips: [
          { _id: '1', reference: 'TRIP001' },
          { _id: '2', reference: 'TRIP002' }
        ]
      };
      const action = { type: deleteTrip.fulfilled.type, payload: '1' };
      const state = tripsReducer(existingState, action);
      expect(state.trips).toHaveLength(1);
      expect(state.trips[0]._id).toBe('2');
    });
  });

  describe('selectors', () => {
    it('should select trips', () => {
      const state = { trips: { trips: [{ _id: '1' }] } };
      expect(selectTrips(state)).toEqual([{ _id: '1' }]);
    });

    it('should select loading', () => {
      const state = { trips: { loading: true } };
      expect(selectTripsLoading(state)).toBe(true);
    });
  });
});
