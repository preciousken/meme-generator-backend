// routes/memeRoutes.js
import express from 'express';
import * as memeController from '../controllers/memeController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Meme:
 *       type: object
 *       required:
 *         - url
 *         - canvasState
 *         - dimensions
 *         - hashTag
 *         - sizeInMB
 *       properties:
 *         url:
 *           type: string
 *           description: The meme image URL or base64 string
 *         canvasState:
 *           type: object
 *           description: The canvas state metadata
 *         dimensions:
 *           type: object
 *           properties:
 *             original:
 *               type: object
 *               properties:
 *                 width:
 *                   type: number
 *                 height:
 *                   type: number
 *             viewport:
 *               type: object
 *               properties:
 *                 width:
 *                   type: number
 *                 height:
 *                   type: number
 *             zoom:
 *               type: number
 *         hashTag:
 *           type: string
 *           description: Unique identifier for the meme
 *         sizeInMB:
 *           type: number
 *           description: Size of the meme in megabytes
 *         likes:
 *           type: number
 *           description: Number of likes
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /memes/get-memes:
 *   get:
 *     summary: Retrieve all memes
 *     tags: [Memes]
 *     responses:
 *       200:
 *         description: List of all memes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meme'
 */
router.get('/get-memes', memeController.getMemes);

/**
 * @swagger
 * /memes/add-meme:
 *   post:
 *     summary: Create a new meme
 *     tags: [Memes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - canvasMetadata
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 encoded image or URL
 *               canvasMetadata:
 *                 type: object
 *                 properties:
 *                   canvasState:
 *                     type: object
 *                   dimensions:
 *                     type: object
 *     responses:
 *       200:
 *         description: Meme created successfully
 */
router.post('/add-meme', memeController.addMeme);

/**
 * @swagger
 * /memes/get-meme-by-hash-tag/{hashTag}:
 *   get:
 *     summary: Get a meme by its hashtag
 *     tags: [Memes]
 *     parameters:
 *       - in: path
 *         name: hashTag
 *         schema:
 *           type: string
 *         required: true
 *         description: Hashtag of the meme
 *     responses:
 *       200:
 *         description: Meme details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meme'
 *       404:
 *         description: Meme not found
 */
router.get('/get-meme-by-hash-tag/:hashTag', memeController.getMemeByHashTag);

/**
 * @swagger
 * /memes/like-meme/{hashTag}:
 *   get:
 *     summary: Like a meme
 *     tags: [Memes]
 *     parameters:
 *       - in: path
 *         name: hashTag
 *         schema:
 *           type: string
 *         required: true
 *         description: Hashtag of the meme to like
 *     responses:
 *       200:
 *         description: Meme liked successfully
 *       404:
 *         description: Meme not found
 */
router.get('/like-meme/:hashTag', memeController.likeMeme);

/**
 * @swagger
 * /memes/unlike-meme/{hashTag}:
 *   get:
 *     summary: Unlike a meme
 *     tags: [Memes]
 *     parameters:
 *       - in: path
 *         name: hashTag
 *         schema:
 *           type: string
 *         required: true
 *         description: Hashtag of the meme to unlike
 *     responses:
 *       200:
 *         description: Meme unliked successfully
 *       404:
 *         description: Meme not found
 */
router.get('/unlike-meme/:hashTag', memeController.unlikeMeme);

/**
 * @swagger
 * /memes/get-random-image:
 *   get:
 *     summary: Get random images from Unsplash
 *     tags: [Memes]
 *     responses:
 *       200:
 *         description: List of random images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get('/get-random-image', memeController.getRandomImage);

export default router;
