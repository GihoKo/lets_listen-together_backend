import express from 'express';
import { getGoogleTokens, renewTokens } from '../services/authService.js';

const router = express.Router();

// 토큰 갱신
router.post('/renewTokens', renewTokens);
// 구글 OAuth 로그인
router.post('/google/callback', getGoogleTokens);

export default router;
