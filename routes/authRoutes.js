import express from 'express';
import { googleAuth } from '../services/authService.js';

const router = express.Router();

router.post('/google', googleAuth);

export default router;
