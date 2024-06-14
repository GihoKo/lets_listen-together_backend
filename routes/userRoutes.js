import express from 'express';

import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../services/userService.js';

const router = express.Router();

// Define routes for user-related operations
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
