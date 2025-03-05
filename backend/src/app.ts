import 'reflect-metadata';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Database Connection

import { DataSource } from 'typeorm';
import { User } from './models/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected.');
  })
  .catch((error) => console.log('Error connecting to database', error));


// Middleware
app.use(express.json());

// Routes
import authRoutes from './routes/authRoutes';
app.use('/auth', authRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the To-Do List API!');
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
