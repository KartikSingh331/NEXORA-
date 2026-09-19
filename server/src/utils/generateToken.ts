import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_ecommerce_2026_xyz', {
    expiresIn: '30d',
  });
};
