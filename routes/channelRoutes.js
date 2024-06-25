import express from 'express';

import {
  getAllChannels,
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel,
  getMusicsByChannelId,
} from '../services/channelService.js';

const router = express.Router();

// 모든 채널 가져오기
router.get('/', getAllChannels);
// id를 이용해 특정 채널 가져오기
router.get('/:channelId', getChannelById);
// 채널 생성하기
router.post('/', createChannel);
// 채널 수정하기
router.patch('/:channelId', updateChannel);
// 채널 삭제하기
router.delete('/:channelId', deleteChannel);
// 해당 채널의 음악 가져오기
router.get('/:channelId/musics', getMusicsByChannelId);

export default router;
