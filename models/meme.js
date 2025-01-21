import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
     url: {
          type: String,
          required: true
     },
     canvasState: {
          type: Object,
          required: true
     },
     dimensions: {
          type: {
               original: {
                    width: { type: Number, required: true },
                    height: { type: Number, required: true }
               },
               viewport: {
                    width: { type: Number, required: true },
                    height: { type: Number, required: true }
               },
               zoom: { type: Number, required: true }
          },
          required: true
     },
     hashTag: {
          type: String,
          unique: true,
          required: true
     },
     sizeInMB: {
          type: Number,
          required: true
     },
     likes: {
          type: Number,
          default: 0
     },
     createdAt: {
          type: Date,
          default: Date.now
     }
});

// Add an index for faster queries
memeSchema.index({ hashTag: 1 });
memeSchema.index({ createdAt: -1 });

export default mongoose.model('Meme', memeSchema);