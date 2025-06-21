// backend/server.js
import dotenv from 'dotenv';
import { connectDB, sequelize  } from './models/index.js';

import app from './app.js';
import express from 'express';
// import { Sitter } from '../models/index.js';
dotenv.config(); 
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();          
    await sequelize.sync();     
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); 
  }
};
// Serve static assets from "frontend"
app.use(express.static('../frontend'));

startServer();