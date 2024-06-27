import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const redirectUri = 'postmessage';
const prisma = new PrismaClient();

export const getGoogleTokens = async (req, res) => {
  // google OAuth code를 받는다
  const { code } = req.body;

  try {
    // 구글 OAuth 토큰을 받는다
    const googleOAuthTokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code: code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // 구글 OAuth 토큰에서 accessToken과 refreshToken을 가져온다
    const { access_token: googleAccessToken, refresh_token: googleRefreshToken } = googleOAuthTokenResponse.data;

    // 구글 사용자 정보 가져오기
    const googleUserInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    });

    const { id, email, name: nickName, picture: profileImage } = googleUserInfoResponse.data;

    // 유저 id를 이용해 DB에서 유저 정보를 찾는다
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    // 유저 정보가 있는 경우
    if (user) {
      // 애플리케이션 accessToken과 refreshToken을 생성한다
      const accessToken = generateAccessToken(id, email);
      const refreshToken = generateRefreshToken(id, email);
      // 유저 정보와 애플리케이션 토큰, 구글 OAuth 토큰을 클라이언트로 보낸다.
      res.status(200).send({
        applicationToken: { accessToken, refreshToken },
        googleToken: { googleAccessToken, googleRefreshToken },
        user,
      });
    } else {
      // 유저 정보가 없는 경우
      // 구글 사용자 정보를 이용해 유저 정보를 생성하고 저장한다.
      await prisma.user.create({
        data: {
          id,
          email,
          nickName,
          profileImage,
        },
      });
      // 유저 정보를 가져온다.
      const newUser = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      // 애플리케이션 accessToken과 refreshToken을 생성한다
      const accessToken = generateAccessToken(id, email);
      const refreshToken = generateRefreshToken(id, email);
      // 유저 정보와 애플리케이션 토큰, 구글 OAuth 토큰을 클라이언트로 보낸다.
      res.status(200).send({
        applicationToken: { accessToken, refreshToken },
        googleToken: { googleAccessToken, googleRefreshToken },
        user: newUser,
      });
    }
  } catch (error) {
    console.error('구글 OAuth 처리 중 오류 발생: ', error.message);
    res.status(500).send('구글 OAuth 처리 중 오류 발생');
  }
};

// 엑세스 토큰 생성함수
const generateAccessToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// 리프레시 토큰 생성함수
const generateRefreshToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.REFRESH_TOKEN_SECRET);
};
