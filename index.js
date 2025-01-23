import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import memeRoutes from './routes/memeRoutes.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { swaggerUi, specs } from './utils/swagger.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: 'Infinity' }));
app.use(cors({
     origin: "*"
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ limit: 'Infinity', extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// .connect mongodb
mongoose.connect(process.env.MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true
}).then(() => {
     console.log("Connected to MongoDB");
}).catch((err) => {
     console.log("Error connecting to MongoDB", err);
});

// Add before routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/memes', memeRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
});
