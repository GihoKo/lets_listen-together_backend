import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 모든 채널 가져오기
const getAllChannels = async (req, res) => {
  try {
    const channels = await prisma.channel.findMany();
    return res.json(channels);
  } catch (error) {
    console.error(error);
  }
};

// id를 이용해 특정 채널 가져오기\
const getChannelById = async (req, res) => {
  const { id } = req.params;
  try {
    const channel = await prisma.channel.findUnique({
      where: {
        id: String(id),
      },
    });
    return res.json(channel);
  } catch (error) {
    console.error(error);
  }
};

// 채널 생성하기
const createChannel = async (req, res) => {
  const { name, description, image, tags } = req.body.channel;
  try {
    const newChannel = await prisma.channel.create({
      data: {
        name,
        description,
        image,
        tags,
      },
    });
    return res.json(newChannel);
  } catch (error) {
    console.error(error);
  }
};

// 채널 수정하기
const updateChannel = async (req, res) => {
  const { id } = req.params;
  const { name, description, image, tags } = req.body.channel;
  try {
    const updatedChannel = await prisma.channel.update({
      where: {
        id: String(id),
      },
      data: {
        name,
        description,
        image,
        tags,
      },
    });
    return res.json(updatedChannel);
  } catch (error) {
    console.error(error);
  }
};

// 채널 삭제하기
const deleteChannel = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedChannel = await prisma.channel.delete({
      where: {
        id: String(id),
      },
    });
    return res.json(deletedChannel);
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
    });
    console.log(musics);
    return res.json(musics);
  } catch (error) {
    console.error(error);
  }
};

export { getAllChannels, getChannelById, createChannel, updateChannel, deleteChannel, getMusicsByChannelId };
