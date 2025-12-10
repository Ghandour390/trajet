import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehiclesReducer from './slices/vehiclesSlice';
import tripsReducer from './slices/tripsSlice';
import fuelReducer from './slices/fuelSlice';
import maintenanceReducer from './slices/maintenanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    trips: tripsReducer,
    fuel: fuelReducer,
    maintenance: maintenanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
