import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import { toNodeHandler } from "better-auth/node";
import { auth } from './src/lib/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
 
// Better Auth-ის handler express.json()-მდე უნდა იყოს!
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});