import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from '../components/ProtectedRoute';
import authReducer from '../store/slices/authSlice';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => {
    mockNavigate(to);
    return <div>Redirecting to {to}</div>;
  },
  Outlet: () => <div>Protected Content</div>
}));

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render protected content when authenticated with correct role', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: { _id: '1', role: 'admin' },
          token: 'valid-token',
          isAuthenticated: true
        }
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute role="admin" />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthenticated: false
        }
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute role="admin" />
        </BrowserRouter>
      </Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should redirect when role does not match', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: { _id: '1', role: 'chauffeur' },
          token: 'valid-token',
          isAuthenticated: true
        }
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute role="admin" />
        </BrowserRouter>
      </Provider>
    );

    expect(mockNavigate).toHaveBeenCalled();
  });

  it('should allow access for chauffeur role', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: { _id: '1', role: 'chauffeur' },
          token: 'valid-token',
          isAuthenticated: true
        }
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute role="chauffeur" />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
