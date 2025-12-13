import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TripForm from '../pages/admin/TripForm';
import tripsReducer from '../store/slices/tripsSlice';

jest.mock('../api/trips');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      trips: tripsReducer,
    },
    preloadedState: {
      trips: {
        trips: [],
        loading: false,
        error: null,
      },
    },
  });
};

describe('TripForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders create trip form', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <TripForm />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Créer un trajet')).toBeInTheDocument();
  });
});
