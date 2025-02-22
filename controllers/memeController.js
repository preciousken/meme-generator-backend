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
     const memes = await Meme.find().sort({ createdAt: -1 });

     return res.json(memes);
};

// Function to generate a random 5-digit number
function generateHashTag() {
     return Math.floor(10000 + Math.random() * 90000).toString();
}

// add meme
export const addMeme = async (req, res) => {
     const { image, canvasMetadata } = req.body;  // Updated to receive canvasMetadata
     const sizeInMB = getBase64SizeInMB(image);

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

     // console.log(canvasMetadata);

     // Create new meme with the complete metadata
     const meme = new Meme({
          url: image,
          canvasState: canvasMetadata.canvasState,
          dimensions: canvasMetadata.dimensions,
          hashTag,
          sizeInMB
     });

     await meme.save();
     res.json({ message: 'Meme added successfully!', hashTag, sizeInMB });
};

export const getMemeByHashTag = async (req, res) => {
     const { hashTag } = req.params;
     try {
          const meme = await Meme.findOne({ hashTag });
          if (meme) {
               // Convert to plain object and ensure all necessary data is included
               const memeData = {
                    ...meme.toObject(),
                    url: meme.url,
                    canvasState: meme.canvasState,
                    dimensions: meme.dimensions,
                    hashTag: meme.hashTag,
                    sizeInMB: meme.sizeInMB,
                    likes: meme.likes,
                    createdAt: meme.createdAt
               };

               // Remove any undefined values
               Object.keys(memeData).forEach(key => 
                    memeData[key] === undefined && delete memeData[key]
               );

               res.json(memeData);
          } else {
               res.status(404).json({ message: 'Meme not found' });
          }
     } catch (error) {
          console.error('Error fetching meme:', error);
          res.status(500).json({ 
               message: 'Server error while fetching meme', 
               error: error.message 
          });
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

