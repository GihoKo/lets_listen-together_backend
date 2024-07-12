// libraries
import express from 'express';

// services
import { deleteUser, getMyChannels, getAllUsers, getUserById, updateUser } from '../services/userService.js';

// utils
import authenticateToken from '../middlewares/authenticateToken.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/:userId', authenticateToken, getUserById);
router.get('/myChannels/:userId', authenticateToken, getMyChannels);
router.get('/myOwnChannels/:userId', authenticateToken, getMyChannels);
router.patch('/:userId', authenticateToken, upload.single('profileImage'), updateUser);
router.delete('/:userId', authenticateToken, deleteUser);

export default router;
