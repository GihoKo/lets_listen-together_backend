import express from 'express';

import authenticateToken from '../middlewares/authenticateToken.js';
import {
  getAllChannels,
  getChannelById,
  createChannel,
  updateChannel,
  subscribeChannel,
  unsubscribeChannel,
  deleteChannel,
  getMusicsByChannelId,
  updateMusicListOrder,
} from '../services/channelService.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// 모든 채널 가져오기
router.get('/', authenticateToken, getAllChannels);
// 해당 채널의 음악 가져오기
router.get('/:channelId/musics', authenticateToken, getMusicsByChannelId);
// id를 이용해 특정 채널 가져오기
router.get('/:channelId', authenticateToken, getChannelById);
// 채널 생성하기
router.post('/', authenticateToken, upload.single('image'), createChannel);
// 채널 구독하기
router.post('/:channelId/subscribe', authenticateToken, subscribeChannel);
// 채널 구독 취소하기
router.post('/:channelId/unsubscribe', authenticateToken, unsubscribeChannel);
// 채널 삭제하기
router.delete('/:channelId', authenticateToken, deleteChannel);
// 해당 채널의 음악 순서 변경하기
router.patch('/music-order', authenticateToken, updateMusicListOrder);
// 채널 수정하기
router.patch('/:channelId', authenticateToken, upload.single('image'), updateChannel);

export default router;
