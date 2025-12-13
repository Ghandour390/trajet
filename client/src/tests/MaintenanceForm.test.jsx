import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import MaintenanceForm from '../pages/admin/MaintenanceForm';
import maintenanceReducer from '../store/slices/maintenanceSlice';
import vehiclesReducer from '../store/slices/vehiclesSlice';

jest.mock('../api/maintenance');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      maintenance: maintenanceReducer,
      vehicles: vehiclesReducer,
    },
    preloadedState: {
      maintenance: {
        records: [],
        loading: false,
        error: null,
      },
      vehicles: {
        vehicles: [],
        loading: false,
        error: null,
      },
    },
  });
};

describe('MaintenanceForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders create maintenance form', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MaintenanceForm />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Planifier une maintenance')).toBeInTheDocument();
  });
});
