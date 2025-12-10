import authReducer, {
  login,
  logout,
  clearError,
  setCredentials,
} from '../../store/slices/authSlice';

/**
 * Tests for authSlice reducer
 */
describe('authSlice reducer', () => {
  const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(
      expect.objectContaining({
        loading: false,
        error: null,
      })
    );
  });

  it('should handle clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error',
    };

    const result = authReducer(stateWithError, clearError());
    expect(result.error).toBeNull();
  });

  it('should handle setCredentials', () => {
    const credentials = {
      user: { id: '1', firstname: 'John', lastname: 'Doe', email: 'john@example.com', role: 'admin' },
      accessToken: 'test-token',
    };

    const result = authReducer(initialState, setCredentials(credentials));

    expect(result.user).toEqual(credentials.user);
    expect(result.accessToken).toBe(credentials.accessToken);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle login.pending', () => {
    const result = authReducer(initialState, { type: login.pending.type });

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle login.fulfilled', () => {
    const payload = {
      user: { id: '1', firstname: 'John', lastname: 'Doe', role: 'chauffeur' },
      accessToken: 'access-token',
    };

    const result = authReducer(initialState, {
      type: login.fulfilled.type,
      payload,
    });

    expect(result.loading).toBe(false);
    expect(result.user).toEqual(payload.user);
    expect(result.accessToken).toBe(payload.accessToken);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle login.rejected', () => {
    const errorMessage = 'Invalid credentials';

    const result = authReducer(initialState, {
      type: login.rejected.type,
      payload: errorMessage,
    });

    expect(result.loading).toBe(false);
    expect(result.error).toBe(errorMessage);
  });

  it('should handle logout.fulfilled', () => {
    const loggedInState = {
      user: { id: '1', firstname: 'John' },
      accessToken: 'token',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const result = authReducer(loggedInState, { type: logout.fulfilled.type });

    expect(result.user).toBeNull();
    expect(result.accessToken).toBeNull();
    expect(result.isAuthenticated).toBe(false);
  });
});
