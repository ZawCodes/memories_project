import express from 'express';
import { signin, signup, googleSignin } from '../controllers/user.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/googleSignin', googleSignin);


export default router;