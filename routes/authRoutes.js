import express from 'express';
import { getGoogleTokens, renewTokens } from '../services/authService.js';

const router = express.Router();

router.post('/renewTokens', renewTokens);

router.post('/google/callback', getGoogleTokens);

export default router;
