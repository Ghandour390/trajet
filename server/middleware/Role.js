import { authenticate, authorize } from './auth.js';

// Backward compatibility
const Role = (...roles) => {
  return [authenticate, authorize(...roles)];
};

export default Role;
export { authenticate, authorize };