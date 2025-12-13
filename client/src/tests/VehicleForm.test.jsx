import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import VehicleForm from '../pages/admin/VehicleForm';
import vehiclesReducer from '../store/slices/vehiclesSlice';

jest.mock('../api/vehicles');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      vehicles: vehiclesReducer,
    },
    preloadedState: {
      vehicles: {
        vehicles: [],
        loading: false,
        error: null,
      },
    },
  });
};

describe('VehicleForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders create vehicle form', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <VehicleForm />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Ajouter un véhicule')).toBeInTheDocument();
  });
});
