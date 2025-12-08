const userService = require('../../services/userService');
const User = require('../../models/User');

jest.mock('../../models/User');

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
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });

      const result = await userService.findAll();

      expect(result).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = { name: 'New User', email: 'new@test.com', password: '123456' };
      const mockUser = { _id: '123', ...userData };
      User.create.mockResolvedValue(mockUser);

      const result = await userService.create(userData);

      expect(result).toEqual(mockUser);
      expect(User.create).toHaveBeenCalledWith(userData);
    });
  });
});
