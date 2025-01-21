import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import memeRoutes from './routes/memeRoutes.js';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(express.json({ limit: 'Infinity' }));
app.use(cors({
     origin: process.env.NODE_ENV === 'production'
          ? ['https://rize2day.com', 'http://rize2day.com', 'http://localhost:5175', 'http://localhost:3000']
          : ['http://localhost:5175', 'http://localhost:3000'],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ limit: 'Infinity', extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// connect mongodb
mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true
}).then(() => {
     console.log("Connected to MongoDB");
}).catch((err) => {
     console.log("Error connecting to MongoDB", err);
});

app.use('/memes', memeRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
});
