import { PrismaClient } from '@prisma/client';
import s3 from '../utils/s3.js';

const prisma = new PrismaClient();

// 모든 채널 가져오기
const getAllChannels = async (req, res) => {
  try {
    const channels = await prisma.channel.findMany({
      include: {
        users: true,
      },
    });
    return res.status(200).json(channels);
  } catch (error) {
    console.error(error);
  }
};

// id를 이용해 특정 채널 가져오기
const getChannelById = async (req, res) => {
  const { channelId } = req.params;
  try {
    const channel = await prisma.channel.findUnique({
      where: {
        id: String(channelId),
      },
      include: {
        users: true,
      },
    });
    return res.status(200).json(channel);
  } catch (error) {
    console.error(error);
  }
};

// 채널 생성하기
const createChannel = async (req, res) => {
  const { name, description, ownerId } = req.body;
  const tags = JSON.parse(req.body.tags);
  const file = req.file;

  if (file) {
    // 이미지가 있는 경우
    const AWSUploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `channel-images/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      // AWS S3에 이미지 업로드
      const AWSResponse = await s3.upload(AWSUploadParams).promise();
      const profileImageUrl = AWSResponse.Location;

      // DB에 채널 생성
      const newChannel = await prisma.channel.create({
        data: {
          name,
          description,
          image: profileImageUrl,
          tags,
          ownerId,
        },
      });

      return res.status(200).json(newChannel);
    } catch (error) {
      console.error(error);
      return res.status(500).send('서버 에러');
    }
  } else {
    // 이미지가 없는 경우
    try {
      const newChannel = await prisma.channel.create({
        data: {
          name,
          description,
          image: '',
          tags,
          ownerId,
        },
      });
      return res.status(200).json(newChannel);
    } catch (error) {
      console.error(error);
    }
  }
};

// 채널 수정하기
const updateChannel = async (req, res) => {
  const { channelId } = req.params;
  const { name, description, image } = req.body;
  const tags = JSON.parse(req.body.tags);
  const file = req.file;

  // 파일이 있는 경우
  if (file) {
    const AWSUploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `channel-images/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const AWSResponse = await s3.upload(AWSUploadParams).promise();
      const profileImageUrl = AWSResponse.Location;

      const updatedChannel = await prisma.channel.update({
        where: {
          id: String(channelId),
        },
        data: {
          name,
          description,
          image: profileImageUrl,
          tags,
        },
      });

      return res.status(200).json(updatedChannel);
    } catch (error) {
      console.error(error);
    }
  }

  // 파일은 없고 파일 url만 있는 경우
  if (!req.file && req.body.image) {
    try {
      const updatedChannel = await prisma.channel.update({
        where: {
          id: String(channelId),
        },
        data: {
          name,
          description,
          image,
          tags,
        },
      });

      return res.status(200).json(updatedChannel);
    } catch (error) {
      console.error(error);
    }
  }

  // 파일도 없고 파일 url도 없는 경우
  if (!req.file && !req.body.image) {
    try {
      const updatedChannel = await prisma.channel.update({
        where: {
          id: String(channelId),
        },
        data: {
          name,
          description,
          tags,
        },
      });

      return res.status(200).json(updatedChannel);
    } catch (error) {
      console.error(error);
    }
  }
};

// 채널 삭제하기
const deleteChannel = async (req, res) => {
  const { channelId } = req.params;
  try {
    const deletedChannel = await prisma.channel.delete({
      where: {
        id: String(channelId),
      },
    });
    return res.status(200).json(deletedChannel);
  } catch (error) {
    console.error(error);
  }
};

// 채널 구독하기
const subscribeChannel = async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.body;

  // 이미 구독한 채널인지 확인
  try {
    const subscribedChannel = await prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        users: true,
      },
    });

    const isSubscribed = subscribedChannel.users.some((user) => user.id === userId);

    if (isSubscribed) {
      return res.status(400).json({ message: '이미 구독한 채널입니다.' });
    }
  } catch (error) {
    console.error(error);
  }

  try {
    // 채널 구독
    const subscribedChannel = await prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    console.log(subscribedChannel);
    return res.status(200).json(subscribedChannel);
  } catch (error) {
    console.error(error);
  }
};

// 채널 구독 취소하기
const unsubscribeChannel = async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.body;

  // 구독 중인 채널인지 확인
  try {
    const subscribedChannel = await prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        users: true,
      },
    });

    const isSubscribed = subscribedChannel.users.some((user) => user.id === userId);

    if (!isSubscribed) {
      return res.status(400).json({ message: '구독 중인 채널이 아닙니다.' });
    }
  } catch (error) {
    console.error;
  }

  try {
    // 채널 구독 취소
    const unsubscribedChannel = await prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return res.status(200).json(unsubscribedChannel);
  } catch (error) {
    console.error(error);
  }
};

// 해당 채널의 음악 가져오기
const getMusicsByChannelId = async (req, res) => {
  const { channelId } = req.params;
  try {
    const musics = await prisma.music.findMany({
      where: {
        channelId: channelId,
      },
      orderBy: {
        order: 'asc', // 'asc'는 오름차순, 'desc'는 내림차순
      },
    });
    return res.status(200).json(musics);
  } catch (error) {
    console.error(error);
  }
};

// 음악 순서 변경하기
const updateMusicListOrder = async (req, res) => {
  const newMusicList = req.body;

  const updatePromises = newMusicList.map((music) => {
    return prisma.music.update({
      where: {
        id: music.id,
      },
      data: {
        order: music.order,
      },
    });
  });

  try {
    const response = await Promise.all(updatePromises);
    console.log(response);
    return res.status(200).json({ message: '음악 순서가 변경되었습니다.' });
  } catch (error) {
    console.error(error);
  }
};

export {
  getAllChannels,
  getChannelById,
  createChannel,
  updateChannel,
  subscribeChannel,
  unsubscribeChannel,
  deleteChannel,
  getMusicsByChannelId,
  updateMusicListOrder,
};
