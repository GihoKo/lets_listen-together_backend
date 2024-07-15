import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({
      message: '토큰이 없습니다.',
    }); // 토큰 없음
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({
          message: '토큰이 만료되었습니다.',
        }); // 토큰 만료
      }

      return res.status(401).send({
        message: '토큰이 유효하지 않습니다.',
      }); // 토큰이 유효하지 않음
    }

    req.user = user;
  });

  next(); // 다음 미들웨어 또는 라우터로 이동
};

export default authenticateToken;
