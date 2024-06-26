import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const redirectUri = 'postmessage';
const googleAuthClient = new OAuth2Client(googleClientId, googleClientSecret, redirectUri);
const prisma = new PrismaClient();

export const getGoogleTokens = async (req, res) => {
  const { code } = req.body;
  console.log('code:', code);

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
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

    const { access_token, refresh_token } = response.data;

    res.status(200).send({ access_token, refresh_token });
  } catch (error) {
    console.error('구글 OAuth 처리 중 오류 발생: ', error.message);
    res.status(500).send('구글 OAuth 처리 중 오류 발생');
  }
};
