import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';

const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const googleAuthClient = new OAuth2Client(googleClientId);
const prisma = new PrismaClient();

const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const { email, name, picture } = ticket.getPayload();

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      // 사용자 정보가 없으면 새로 생성
      await prisma.user.create({
        data: {
          email,
          nickName: name,
          profileImage: picture,
        },
      });
    } else {
      // 사용자 정보가 있으면 업데이트
      await prisma.user.update({
        where: { email },
        data: {
          nickName: name,
          profileImage: picture,
        },
      });
    }

    // 사용자 정보 가져오기
    const userData = await prisma.user.findUnique({
      where: { email },
    });

    // 클라이언트로 전달
    res.status(200).json(userData);
  } catch (error) {
    console.error('구글 OAuth 처리 중 오류 발생: ', error.message);
  }
};

export { googleAuth };
