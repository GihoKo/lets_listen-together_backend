import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getMusicById = async (req, res) => {
  const { musicId } = req.params;
  try {
    const music = await prisma.music.findUnique({
      where: {
        id: String(musicId),
      },
    });
    return res.json(music);
  } catch (error) {
    console.error(error);
  }
};

const createMusic = async (req, res) => {
  const { channelId, order, title, artist, url } = req.body;
  try {
    const newMusic = await prisma.music.create({
      data: {
        order,
        title,
        artist,
        url,
        channel: {
          connect: {
            id: channelId,
          },
        },
      },
    });
    return res.json(newMusic);
  } catch (error) {
    console.error(error);
  }
};

const updateMusic = async (req, res) => {
  const { musicId } = req.params;
  const { title, artist, url } = req.body;
  try {
    const updatedMusic = await prisma.music.update({
      where: {
        id: String(musicId),
      },
      data: {
        title: title,
        artist: artist,
        url: url,
      },
    });
    return res.json(updatedMusic);
  } catch (error) {
    console.error(error);
  }
};

const deleteMusic = async (req, res) => {
  const { musicId } = req.params;
  try {
    const deletedMusic = await prisma.music.delete({
      where: {
        id: String(musicId),
      },
    });
    return res.json(deletedMusic);
  } catch (error) {
    console.error(error);
  }
};

export { getMusicById, createMusic, updateMusic, deleteMusic };
