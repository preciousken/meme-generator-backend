// controllers/memeController.js
import Meme from '../models/meme.js';
import { getBase64SizeInMB, saveBase64Image, isValidUrl } from '../utils/helper.js';
import { createApi } from 'unsplash-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Unsplash API
const unsplash = createApi({
     accessKey: process.env.UNSPLASH_ACCESS_KEY,
     fetch: fetch
});

export const getMemes = async (req, res) => {
     const serverUrl = `${req.protocol}://${req.get('host')}`;
     const memes = await Meme.find().sort({ createdAt: -1 });

     const memesWithFullUrl = memes.map(meme => {
          let fullUrl = meme.url;
          if (!isValidUrl(meme.url) && meme.url.startsWith('/uploads')) {
               fullUrl = `${serverUrl}${meme.url}`;
          }
          return {
               ...meme.toObject(),
               url: fullUrl
          };
     });

     res.json(memesWithFullUrl);
};

// Function to generate a random 5-digit number
function generateHashTag() {
     return Math.floor(10000 + Math.random() * 90000).toString();
}

// add meme
export const addMeme = async (req, res) => {
     const { image } = req.body;
     const sizeInMB = getBase64SizeInMB(image);
     console.log(`Size of base64 image: ${sizeInMB} MB`);

     let hashTag;
     let isUnique = false;

     // Ensure the hash tag is unique
     while (!isUnique) {
          hashTag = generateHashTag();
          const existingMeme = await Meme.findOne({ hashTag });
          if (!existingMeme) {
               isUnique = true;
          }
     }

     // Convert base64 image to server URL
     const imageUrl = saveBase64Image(image, './uploads');

     const meme = new Meme({ url: imageUrl, base64: image, hashTag, sizeInMB });
     await meme.save();
     res.json({ message: 'Meme added successfully!', hashTag, sizeInMB });
};

export const getMemeByHashTag = async (req, res) => {
     const { hashTag } = req.params;
     try {
          const meme = await Meme.findOne({ hashTag });
          if (meme) {
               const serverUrl = `${req.protocol}://${req.get('host')}`;
               const fullUrl = !isValidUrl(meme.url) && meme.url.startsWith('/uploads')
                    ? `${serverUrl}${meme.url}`
                    : meme.url;

               res.json({
                    ...meme.toObject(),
                    url: fullUrl
               });
          } else {
               res.status(404).json({ message: 'Meme not found' });
          }
     } catch (error) {
          res.status(500).json({ message: 'Server error', error });
     }
};

export const likeMeme = async (req, res) => {
     const { hashTag } = req.params;
     try {
          const meme = await Meme.findOneAndUpdate(
               { hashTag },
               { $inc: { likes: 1 } },
               { new: true }
          );
          if (meme) {
               res.json({ message: 'Meme liked successfully!', likes: meme.likes });
          } else {
               res.status(404).json({ message: 'Meme not found' });
          }
     } catch (error) {
          res.status(500).json({ message: 'Server error', error });
     }
};


export const unlikeMeme = async (req, res) => {
     const { hashTag } = req.params;
     try {
          const meme = await Meme.findOneAndUpdate(
               { hashTag, likes: { $gt: 0 } },
               { $inc: { likes: -1 } },
               { new: true }
          );
          if (meme) {
               res.json({ message: 'Meme unliked successfully!', likes: meme.likes });
          } else {
               res.status(404).json({ message: 'Meme not found or already at zero likes' });
          }
     } catch (error) {
          res.status(500).json({ message: 'Server error', error });
     }
};

export const getRandomImage = async (req, res) => {
     try {
          const result = await unsplash.photos.getRandom({ count: 5 });
          if (result.errors) {
               res.status(500).json({ message: 'Error fetching images', errors: result.errors });
          } else {
               const images = result.response.map(image => ({
                    url: image.urls.regular,
                    description: image.description || image.alt_description
               }));
               res.json(images);
          }
     } catch (error) {
          res.status(500).json({ message: 'Server error', error });
     }
};

