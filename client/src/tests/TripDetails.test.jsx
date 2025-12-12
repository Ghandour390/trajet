import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TripDetails from '../pages/chauffeur/TripDetails';
import tripsReducer from '../store/slices/tripsSlice';
import fuelReducer from '../store/slices/fuelSlice';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'trip123' }),
  useNavigate: () => jest.fn()
}));

const mockTrip = {
  _id: 'trip123',
  reference: 'TRIP001',
  origin: 'Casablanca',
  destination: 'Rabat',
  status: 'planned',
  vehicleRef: { _id: 'vehicle123', plateNumber: 'A-12345-B' },
  trailerRef: { _id: 'trailer123', plateNumber: 'R-22222-B' },
  assignedTo: { _id: 'driver123', firstname: 'John', lastname: 'Doe' },
  distimatedKm: 100,
  startAt: '2024-01-15T08:00:00',
  startKm: 0,
  endKm: 0
};

const mockStore = configureStore({
  reducer: {
    trips: tripsReducer,
    fuel: fuelReducer
  },
  preloadedState: {
    trips: {
      trips: [],
      currentTrip: mockTrip,
      loading: false,
      error: null
    },
    fuel: {
      records: [],
      loading: false,
      error: null
    }
  }
});

describe('TripDetails Component', () => {
  it('should render trip details', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <TripDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Détails du trajet')).toBeInTheDocument();
    expect(screen.getByText('Casablanca')).toBeInTheDocument();
    expect(screen.getByText('Rabat')).toBeInTheDocument();
  });

  it('should show start button for planned trip', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <TripDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Démarrer le trajet')).toBeInTheDocument();
  });

  it('should show fuel form when button clicked', () => {
    const inProgressStore = configureStore({
      reducer: {
        trips: tripsReducer,
        fuel: fuelReducer
      },
      preloadedState: {
        trips: {
          trips: [],
          currentTrip: { ...mockTrip, status: 'in_progress' },
          loading: false,
          error: null
        },
        fuel: {
          records: [],
          loading: false,
          error: null
        }
      }
    });

    render(
      <Provider store={inProgressStore}>
        <BrowserRouter>
          <TripDetails />
        </BrowserRouter>
      </Provider>
    );

    const fuelButton = screen.getByText('Ajouter carburant');
    fireEvent.click(fuelButton);

    expect(screen.getByText('Enregistrer du carburant')).toBeInTheDocument();
    expect(screen.getByLabelText('Litres')).toBeInTheDocument();
  });

  it('should update kilometrage form', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <TripDetails />
        </BrowserRouter>
      </Provider>
    );

    const startKmInput = screen.getByPlaceholderText('150000');
    fireEvent.change(startKmInput, { target: { value: '10000' } });

    expect(startKmInput.value).toBe('10000');
  });

  it('should display loading state', () => {
    const loadingStore = configureStore({
      reducer: {
        trips: tripsReducer,
        fuel: fuelReducer
      },
      preloadedState: {
        trips: {
          trips: [],
          currentTrip: null,
          loading: true,
          error: null
        },
        fuel: {
          records: [],
          loading: false,
          error: null
        }
      }
    });

    render(
      <Provider store={loadingStore}>
        <BrowserRouter>
          <TripDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('should display not found message', () => {
    const notFoundStore = configureStore({
      reducer: {
        trips: tripsReducer,
        fuel: fuelReducer
      },
      preloadedState: {
        trips: {
          trips: [],
          currentTrip: null,
          loading: false,
          error: null
        },
        fuel: {
          records: [],
          loading: false,
          error: null
        }
      }
    });

    render(
      <Provider store={notFoundStore}>
        <BrowserRouter>
          <TripDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Trajet non trouvé')).toBeInTheDocument();
  });
});
