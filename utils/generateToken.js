import jwt from 'jsonwebtoken';

// 엑세스 토큰 생성함수
export const generateAccessToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// 리프레시 토큰 생성함수
export const generateRefreshToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET);
};
