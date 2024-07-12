import express from 'express';
import authenticateToken from '../middlewares/authenticateToken.js';

import { getMusicById, createMusic, updateMusic, deleteMusic } from '../services/musicService.js';

const router = express.Router();

router.get('/:musicId', authenticateToken, getMusicById);
router.post('/', authenticateToken, createMusic);
router.patch('/:musicId', authenticateToken, updateMusic);
router.delete('/:musicId', authenticateToken, deleteMusic);

export default router;
