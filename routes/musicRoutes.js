import express from 'express';

import { getMusicById, createMusic, updateMusic, deleteMusic } from '../services/musicService.js';

const router = express.Router();

router.get('/:musicId', getMusicById);
router.post('/', createMusic);
router.patch('/:musicId', updateMusic);
router.delete('/:musicId', deleteMusic);

export default router;
