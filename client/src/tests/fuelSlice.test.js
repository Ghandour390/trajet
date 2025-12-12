import fuelReducer, {
  getFuelRecords,
  createFuelRecord,
  deleteFuelRecord,
  getFuelStats,
  selectFuelRecords,
  selectFuelLoading
} from '../store/slices/fuelSlice';

describe('fuelSlice', () => {
  const initialState = {
    records: [],
    tripFuel: [],
    stats: null,
    loading: false,
    error: null,
    totalCount: 0
  };

  it('should return initial state', () => {
    expect(fuelReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('getFuelRecords', () => {
    it('should set loading true on pending', () => {
      const action = { type: getFuelRecords.pending.type };
      const state = fuelReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set records on fulfilled', () => {
      const records = [{ _id: '1', liters: 50 }];
      const action = { type: getFuelRecords.fulfilled.type, payload: records };
      const state = fuelReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.records).toEqual(records);
    });

    it('should set error on rejected', () => {
      const error = 'Failed to fetch';
      const action = { type: getFuelRecords.rejected.type, payload: error };
      const state = fuelReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
    });
  });

  describe('createFuelRecord', () => {
    it('should add record on fulfilled', () => {
      const newRecord = { _id: '2', liters: 60 };
      const action = { type: createFuelRecord.fulfilled.type, payload: newRecord };
      const state = fuelReducer(initialState, action);
      expect(state.records).toContainEqual(newRecord);
      expect(state.loading).toBe(false);
    });
  });

  describe('deleteFuelRecord', () => {
    it('should remove record on fulfilled', () => {
      const existingState = {
        ...initialState,
        records: [
          { _id: '1', liters: 50 },
          { _id: '2', liters: 60 }
        ]
      };
      const action = { type: deleteFuelRecord.fulfilled.type, payload: '1' };
      const state = fuelReducer(existingState, action);
      expect(state.records).toHaveLength(1);
      expect(state.records[0]._id).toBe('2');
    });
  });

  describe('getFuelStats', () => {
    it('should set stats on fulfilled', () => {
      const stats = { totalLiters: 100, totalCost: 1000 };
      const action = { type: getFuelStats.fulfilled.type, payload: stats };
      const state = fuelReducer(initialState, action);
      expect(state.stats).toEqual(stats);
      expect(state.loading).toBe(false);
    });
  });

  describe('selectors', () => {
    it('should select fuel records', () => {
      const state = { fuel: { records: [{ _id: '1' }] } };
      expect(selectFuelRecords(state)).toEqual([{ _id: '1' }]);
    });

    it('should select loading', () => {
      const state = { fuel: { loading: true } };
      expect(selectFuelLoading(state)).toBe(true);
    });
  });
});
