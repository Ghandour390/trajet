import { jest, describe, it, expect, afterEach } from '@jest/globals';

const mockUser = {
  find: jest.fn(),
  create: jest.fn()
};

jest.unstable_mockModule('../../models/User.js', () => ({
  default: mockUser
}));

const { default: userService } = await import('../../services/userService.js');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users without password', async () => {
      const mockUsers = [
        { name: 'User 1', email: 'user1@test.com' },
        { name: 'User 2', email: 'user2@test.com' }
      ];
      mockUser.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });

      const result = await userService.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUser.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { name: 'New User', email: 'new@test.com', password: '123456' };
      const createdUser = { _id: '123', ...userData };
      mockUser.create.mockResolvedValue(createdUser);

      const result = await userService.create(userData);

      expect(result).toEqual(createdUser);
      expect(mockUser.create).toHaveBeenCalledWith(userData);
    });
  });
});
