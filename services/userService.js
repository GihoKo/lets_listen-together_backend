import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

const createUser = (req, res) => {
  res.send('Create user');
};

const updateUser = (req, res) => {
  res.send(`Update user by ID: ${req.params.id}`);
};

const deleteUser = (req, res) => {
  res.send(`Delete user by ID: ${req.params.id}`);
};

export { getAllUsers, getUserById, getMyChannels, getMyOwnChannels, createUser, updateUser, deleteUser };
