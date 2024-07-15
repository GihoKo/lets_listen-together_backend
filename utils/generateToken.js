import jwt from 'jsonwebtoken';

export const generateToken = (type, id, email) => {
  if (type === 'accessToken') {
    const accessToken = jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return accessToken;
  }
  if (type === 'refreshToken') {
    const refreshToken = jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET);
    return refreshToken;
  }
};
