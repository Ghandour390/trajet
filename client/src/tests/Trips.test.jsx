import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Trips from '../pages/admin/Trips';
import tripsReducer from '../store/slices/tripsSlice';
import vehiclesReducer from '../store/slices/vehiclesSlice';

const mockStore = configureStore({
  reducer: {
    trips: tripsReducer,
    vehicles: vehiclesReducer
  },
  preloadedState: {
    trips: {
      trips: [
        {
          _id: '1',
          reference: 'TRIP001',
          origin: 'Casablanca',
          destination: 'Rabat',
          status: 'planned',
          vehicleRef: { plateNumber: 'A-12345-B' },
          assignedTo: { firstname: 'John', lastname: 'Doe' }
        }
      ],
      loading: false,
      error: null
    },
    vehicles: {
      vehicles: [],
      loading: false
    }
  }
});

describe('Trips Component', () => {
  it('should render trips list', () => {
    render(
      <Provider store={mockStore}>
        <Trips />
      </Provider>
    );

    expect(screen.getByText('Trajets')).toBeInTheDocument();
    expect(screen.getByText('TRIP001')).toBeInTheDocument();
    expect(screen.getByText('Casablanca')).toBeInTheDocument();
  });

  it('should open create modal on button click', () => {
    render(
      <Provider store={mockStore}>
        <Trips />
      </Provider>
    );

    const createButton = screen.getByText('Créer un trajet');
    fireEvent.click(createButton);

    expect(screen.getByText('Créer un trajet')).toBeInTheDocument();
  });

  it('should filter trips by search term', async () => {
    render(
      <Provider store={mockStore}>
        <Trips />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText(/Rechercher par origine/i);
    fireEvent.change(searchInput, { target: { value: 'Casa' } });

    await waitFor(() => {
      expect(screen.getByText('TRIP001')).toBeInTheDocument();
    });
  });

  it('should filter trips by status', () => {
    render(
      <Provider store={mockStore}>
        <Trips />
      </Provider>
    );

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'planned' } });

    expect(screen.getByText('TRIP001')).toBeInTheDocument();
  });

  it('should display empty message when no trips', () => {
    const emptyStore = configureStore({
      reducer: {
        trips: tripsReducer,
        vehicles: vehiclesReducer
      },
      preloadedState: {
        trips: {
          trips: [],
          loading: false,
          error: null
        },
        vehicles: {
          vehicles: [],
          loading: false
        }
      }
    });

    render(
      <Provider store={emptyStore}>
        <Trips />
      </Provider>
    );

    expect(screen.getByText('Aucun trajet trouvé')).toBeInTheDocument();
  });
});
