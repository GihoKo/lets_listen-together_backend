import express from 'express';

import {
  createUser,
  deleteUser,
  getMyChannels,
  getAllUsers,
  getUserById,
  updateUser,
} from '../services/userService.js';
import authenticateToken from '../middlewares/authenticateToken.js';

const router = express.Router();

// Define routes for user-related operations
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.get('/myChannels/:userId', authenticateToken, getMyChannels);
router.post('/', createUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;
