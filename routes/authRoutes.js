import express from 'express';
import { getGoogleTokens } from '../services/authService.js';

const router = express.Router();

router.post('/google/callback', getGoogleTokens);

export default router;
