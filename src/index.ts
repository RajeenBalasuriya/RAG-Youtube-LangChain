import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import storeDocumentRoutes from './routes/storeDocumentRoutes.js'; // Import your routes
import queryDocumentRoutes from './routes/queryDocumentRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
    origin:"http://localhost:5173", // Adjust this to your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",  
    allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


//application routes 
app.use('/store-document',storeDocumentRoutes);
app.use('/query-document',queryDocumentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
