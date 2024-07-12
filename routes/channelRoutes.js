import express from 'express';

import authenticateToken from '../middlewares/authenticateToken.js';
import {
  getAllChannels,
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel,
  getMusicsByChannelId,
} from '../services/channelService.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// 모든 채널 가져오기
router.get('/', authenticateToken, getAllChannels);
// id를 이용해 특정 채널 가져오기
router.get('/:channelId', authenticateToken, getChannelById);
// 채널 생성하기
router.post('/', authenticateToken, upload.single('channelImage'), createChannel);
// 채널 수정하기
router.patch('/:channelId', authenticateToken, updateChannel);
// 채널 삭제하기
router.delete('/:channelId', authenticateToken, deleteChannel);
// 해당 채널의 음악 가져오기
router.get('/:channelId/musics', authenticateToken, getMusicsByChannelId);

export default router;
