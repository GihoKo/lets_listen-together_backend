import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { generateToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

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

    // 필요한 사용자 정보를 가져온다
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
      const accessToken = generateToken('accessToken', id, email);
      const refreshToken = generateToken('refreshToken', id, email);

      // 리프레시 토큰을 cookie에 저장한다
      // 이후에 클라이언트에서 api 요청을 보낼 때 마다 자동으로 refreshToken cookie를 보내게 된다
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 하루동안
        secure: process.env.NODE_ENV === 'production' ? true : false, // https에서만 사용
        sameSite: 'strict',
      });

      res.cookie('googleRefreshToken', googleRefreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 하루동안
        secure: process.env.NODE_ENV === 'production' ? true : false, // https에서만 사용
        sameSite: 'strict',
      });

      // 유저 정보와 애플리케이션 토큰, 구글 OAuth 토큰을 클라이언트로 보낸다.
      res.status(200).send({
        applicationAccessToken: accessToken,
        googleAccessToken: googleAccessToken,
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
      const accessToken = generateToken('accessToken', id, email);
      const refreshToken = generateToken('refreshToken', id, email);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 하루동안
        secure: process.env.NODE_ENV === 'production' ? true : false, // https에서만 사용
        sameSite: 'strict',
      });

      res.cookie('googleRefreshToken', googleRefreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 하루동안
        secure: process.env.NODE_ENV === 'production' ? true : false, // https에서만 사용
        sameSite: 'strict',
      });

      // 유저 정보와 애플리케이션 토큰, 구글 OAuth 토큰을 클라이언트로 보낸다.
      res.status(200).send({
        applicationAccessToken: accessToken,
        googleAccessToken: googleAccessToken,
        user: newUser,
      });
    }
  } catch (error) {
    console.error('구글 OAuth 처리 중 오류 발생: ', error.message);
    res.status(500).send('구글 OAuth 처리 중 오류 발생');
  }
};

export const renewTokens = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'refreshToken이 없습니다. 로그인이 필요합니다' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({ message: 'refreshToken이 유효하지 않습니다. 로그인이 필요합니다' });
    }

    const accessToken = generateToken('accessToken', user.id, user.email);
    const refreshToken = generateToken('refreshToken', user.id, user.email);

    // 리프레시 토큰을 쿠키에 저장
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 하루동안
      secure: process.env.NODE_ENV === 'production' ? true : false, // https에서만 사용
      sameSite: 'strict',
    });

    // 엑세스 토큰을 보냄
    res.status(200).send({ applicationAccessToken: accessToken });
  });
};
