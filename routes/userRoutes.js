// libraries
import express from 'express';
import multer from 'multer';

// services
import { deleteUser, getMyChannels, getAllUsers, getUserById, updateUser } from '../services/userService.js';

// utils
import authenticateToken from '../middlewares/authenticateToken.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.get('/myChannels/:userId', authenticateToken, getMyChannels);
router.get('/myOwnChannels/:userId', authenticateToken, getMyChannels);
router.patch('/:userId', authenticateToken, upload.single('profileImage'), updateUser);
router.delete('/:userId', deleteUser);

export default router;
