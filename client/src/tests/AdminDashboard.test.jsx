import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../../pages/admin/Dashboard';
import authReducer from '../../store/slices/authSlice';
import vehiclesReducer from '../../store/slices/vehiclesSlice';
import tripsReducer from '../../store/slices/tripsSlice';
import maintenanceReducer from '../../store/slices/maintenanceSlice';

/**
 * Tests for AdminDashboard component
 */

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      vehicles: vehiclesReducer,
      trips: tripsReducer,
      maintenance: maintenanceReducer,
    },
    preloadedState: {
      auth: {
        user: { firstname: 'Admin', lastname: 'User', role: 'admin' },
        accessToken: 'test-token',
        isAuthenticated: true,
        loading: false,
        error: null,
        ...initialState.auth,
      },
      vehicles: {
        vehicles: [],
        currentVehicle: null,
        loading: false,
        error: null,
        totalCount: 0,
        ...initialState.vehicles,
      },
      trips: {
        trips: [],
        myTrips: [],
        currentTrip: null,
        loading: false,
        error: null,
        totalCount: 0,
        ...initialState.trips,
      },
      maintenance: {
        records: [],
        vehicleMaintenance: [],
        currentMaintenance: null,
        loading: false,
        error: null,
        totalCount: 0,
        ...initialState.maintenance,
      },
    },
  });
};

// Wrapper component
const renderWithProviders = (component, initialState = {}) => {
  const store = createMockStore(initialState);
  
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('AdminDashboard', () => {
  it('renders the dashboard title', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    });
  });

  it('renders welcome message', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(
        screen.getByText("Bienvenue dans votre espace d'administration")
      ).toBeInTheDocument();
    });
  });

  it('renders stats cards', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Véhicules')).toBeInTheDocument();
      expect(screen.getByText('Trajets en cours')).toBeInTheDocument();
      expect(screen.getByText('Chauffeurs actifs')).toBeInTheDocument();
      expect(screen.getByText('Maintenance en attente')).toBeInTheDocument();
    });
  });

  it('renders chart sections', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Consommation de carburant')).toBeInTheDocument();
      expect(screen.getByText('Kilométrage mensuel')).toBeInTheDocument();
    });
  });

  it('renders recent trips section', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Trajets récents')).toBeInTheDocument();
    });
  });

  it('shows empty state when no trips', async () => {
    renderWithProviders(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Aucun trajet récent')).toBeInTheDocument();
    });
  });

  it('displays vehicle stats correctly', async () => {
    const initialState = {
      vehicles: {
        vehicles: [
          { _id: '1', matricule: 'AA-123-BB', status: 'active' },
          { _id: '2', matricule: 'CC-456-DD', status: 'maintenance' },
        ],
      },
      trips: {
        trips: [
          { _id: '1', status: 'in_progress', driver: { _id: 'd1' } },
        ],
      },
    };

    renderWithProviders(<AdminDashboard />, initialState);
    
    await waitFor(() => {
      // The stats should reflect the data
      expect(screen.getByText('2')).toBeInTheDocument(); // 2 vehicles
    });
  });
});
