import { PrismaClient } from '@prisma/client';
import s3 from '../utils/s3.js';

const prisma = new PrismaClient();

// 모든 채널 가져오기
const getAllChannels = async (req, res) => {
  try {
    const channels = await prisma.channel.findMany();
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
    });
    return res.status(200).json(channel);
  } catch (error) {
    console.error(error);
  }
};

// 채널 생성하기
const createChannel = async (req, res) => {
  const { name, description, tags, ownerId } = req.body;
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
  const { name, description, image, tags } = req.body.channel;
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

// 해당 채널의 음악 가져오기
const getMusicsByChannelId = async (req, res) => {
  const { channelId } = req.params;
  console.log(channelId);
  try {
    const musics = await prisma.music.findMany({
      where: {
        channelId: channelId,
      },
    });
    return res.status(200).json(musics);
  } catch (error) {
    console.error(error);
  }
};

export { getAllChannels, getChannelById, createChannel, updateChannel, deleteChannel, getMusicsByChannelId };
