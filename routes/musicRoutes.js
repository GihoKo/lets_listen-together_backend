import express from 'express';

import { getMusicById, createMusic, updateMusic, deleteMusic } from '../services/musicService.js';

const router = express.Router();

router.get('/:id', getMusicById);
router.post('/', createMusic);
router.patch('/:id', updateMusic);
router.delete('/:id', deleteMusic);

export default router;
