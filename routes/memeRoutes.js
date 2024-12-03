// routes/memeRoutes.js
import express from 'express';
import * as memeController from '../controllers/memeController.js';

const router = express.Router();

router.get('/get-memes', memeController.getMemes);
router.post('/add-meme', memeController.addMeme);
router.get('/get-meme-by-hash-tag/:hashTag', memeController.getMemeByHashTag);
router.get('/like-meme/:hashTag', memeController.likeMeme);
router.get('/get-random-image', memeController.getRandomImage);

export default router;
