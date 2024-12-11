import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
     url: String,
     canvasState: { type: Object, default: null },
     // base64: String,
     hashTag: { type: String, unique: true },
     sizeInMB: Number,
     likes: { type: Number, default: 0 },
     createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Meme', memeSchema);
