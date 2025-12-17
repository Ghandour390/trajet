import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vehiclesReducer from './slices/vehiclesSlice';
import trailersReducer from './slices/trailersSlice';
import tripsReducer from './slices/tripsSlice';
import fuelReducer from './slices/fuelSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import notificationsReducer from './slices/notificationsSlice';
import dashboardReducer from './slices/dashboardSlice';
import reportsReducer from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehiclesReducer,
    trailers: trailersReducer,
    trips: tripsReducer,
    fuel: fuelReducer,
    maintenance: maintenanceReducer,
    notifications: notificationsReducer,
    dashboard: dashboardReducer,
    reports: reportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
