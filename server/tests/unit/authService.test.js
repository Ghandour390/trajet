import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockUser = {
  findOne: jest.fn(),
  findById: jest.fn(),
  save: jest.fn()
};

const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn()
};

const mockJwt = {
  sign: jest.fn(),
  verify: jest.fn()
};

const UserConstructor = function(data) {
  this.data = data;
  this.save = mockUser.save;
};
UserConstructor.findOne = mockUser.findOne;
UserConstructor.findById = mockUser.findById;

jest.unstable_mockModule('../../models/User.js', () => ({
  default: UserConstructor
}));

jest.unstable_mockModule('bcryptjs', () => ({ default: mockBcrypt }));
jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

const { default: AuthService } = await import('../../services/authService.js');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user with hashed password', async () => {
      const userData = { email: 'test@test.com', password: 'password123', firstname: 'John', lastname: 'Doe' };
      mockBcrypt.hash.mockResolvedValue('hashedPassword');
      mockUser.save.mockResolvedValue({
        ...userData,
        passwordHash: 'hashedPassword',
        role: 'chauffeur',
        toObject: () => ({ ...userData, passwordHash: 'hashedPassword', role: 'chauffeur' })
      });

      const result = await AuthService.register(userData);

      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('login', () => {
    it('should return tokens and user data on valid credentials', async () => {
      const user = {
        _id: 'userId',
        email: 'test@test.com',
        passwordHash: 'hashedPassword',
        firstname: 'John',
        lastname: 'Doe',
        role: 'user'
      };

      mockUser.findOne.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(true);
      mockJwt.sign.mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

      const result = await AuthService.login('test@test.com', 'password123');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toHaveProperty('email', 'test@test.com');
    });

    it('should throw error if user not found', async () => {
      mockUser.findOne.mockResolvedValue(null);

      await expect(AuthService.login('test@test.com', 'password123'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error if password is invalid', async () => {
      mockUser.findOne.mockResolvedValue({ email: 'test@test.com', passwordHash: 'hashedPassword' });
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(AuthService.login('test@test.com', 'wrongPassword'))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('refreshToken', () => {
    it('should return new accessToken with valid refreshToken', async () => {
      const user = { _id: 'userId', role: 'user' };
      
      mockJwt.verify.mockReturnValue({ id: 'userId' });
      mockUser.findById.mockResolvedValue(user);
      mockJwt.sign.mockReturnValue('newAccessToken');

      const result = await AuthService.refreshToken('validRefreshToken');

      expect(result).toHaveProperty('accessToken');
    });

    it('should throw error if refreshToken is invalid', async () => {
      mockJwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

      await expect(AuthService.refreshToken('invalidToken'))
        .rejects.toThrow('Invalid refresh token');
    });

    it('should throw error if user not found', async () => {
      mockJwt.verify.mockReturnValue({ id: 'userId' });
      mockUser.findById.mockResolvedValue(null);

      await expect(AuthService.refreshToken('validRefreshToken'))
        .rejects.toThrow('User not found');
    });
  });
});
