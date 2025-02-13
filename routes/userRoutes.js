import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';
import {
  authUser,
  getUserProfile,
  googleAuthCallback,
  logoutUser,
  registerUser,
  updateUserProfile
} from '../controllers/userController.js';
import { adminOnly, instituteOnly, protect } from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();


router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Example of role-based routes (you can add more as needed)
router.get('/admin-only', protect, adminOnly, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

router.get('/institute-only', protect, instituteOnly, (req, res) => {
  res.json({ message: 'Institute access granted' });
});

router.get('/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false 
  }),
  googleAuthCallback
);

export default router;
