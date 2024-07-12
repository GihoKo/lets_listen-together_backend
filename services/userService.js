import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';

const prisma = new PrismaClient();

// AWS 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const getAllUsers = (req, res) => {
  res.send('Get all users');
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
  }
};

// 내가 속한 채널 가져오기
const getMyChannels = async (req, res) => {
  const { userId } = req.params;
  console.log('userId : ', userId);
  try {
    // user테이블에서 id가 userId인 user를 찾고(where) channels와 ownedChannels를 가져온다(include)
    const channels = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        channels: true,
        ownedChannels: true,
      },
    });

    const myChannels = [...channels.channels, ...channels.ownedChannels];

    return res.json(myChannels);
  } catch (error) {
    console.error(error);
  }
};

const getMyOwnChannels = async (req, res) => {
  const { userId } = req.params;
  try {
    const channels = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        ownedChannels: true,
      },
    });
    return res.json(channels.ownedChannels);
  } catch (error) {
    console.error(error);
  }
};

const updateUser = async (req, res) => {
  const { id, nickName, email } = req.body;
  const file = req.file;

  if (file) {
    // 이미지가 있는 경우
    const AWSUploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `profile-images/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      // AWS S3에 이미지 업로드
      const AWSResponse = await s3.upload(AWSUploadParams).promise();
      const profileImageUrl = AWSResponse.Location;

      // DB에 유저 정보 업데이트
      const response = await prisma.user.update({
        where: {
          id,
        },
        data: {
          nickName,
          email,
          profileImage: profileImageUrl,
        },
      });

      return res.status(200).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send('서버 에러');
    }
  } else {
    // 이미지가 없는 경우
    try {
      const response = await prisma.user.update({
        where: {
          id,
        },
        data: {
          nickName,
          email,
        },
      });

      return res.status(200).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send('서버 에러');
    }
  }
};

const deleteUser = (req, res) => {
  res.send(`Delete user by ID: ${req.params.id}`);
};

export { getAllUsers, getUserById, getMyChannels, getMyOwnChannels, updateUser, deleteUser };
