import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getMusicById = async (req, res) => {
  const { id } = req.params;
  try {
    const music = await prisma.music.findUnique({
      where: {
        id: String(id),
      },
    });
    return res.json(music);
  } catch (error) {
    console.error(error);
  }
};

const createMusic = async (req, res) => {
  console.log(req.body);
  const { channelId, title, artist, url } = req.body.music;
  try {
    const newMusic = await prisma.music.create({
      data: {
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
  const { id } = req.params;
  const { title, artist, url } = req.body.music;
  try {
    const updatedMusic = await prisma.music.update({
      where: {
        id: String(id),
      },
      data: {
        title,
        artist,
        url,
      },
    });
    return res.json(updatedMusic);
  } catch (error) {
    console.error(error);
  }
};

const deleteMusic = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMusic = await prisma.music.delete({
      where: {
        id: String(id),
      },
    });
    return res.json(deletedMusic);
  } catch (error) {
    console.error(error);
  }
};

export { getMusicById, createMusic, updateMusic, deleteMusic };
