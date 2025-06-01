import 'reflect-metadata';
import morgan from 'morgan';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import errorHandler from './middlewares/errorHandler';

const app = express();
app.use(morgan('dev')); // logs every request to the console (method, status, response time)

// Database Connection

import { DataSource } from 'typeorm';
import { User } from './models/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true, // Set to false in production
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
  extra: {
    ssl: false, // Set to true if using SSL in production
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
import { error } from 'console';
app.use('/auth', authRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the To-Do List API!');
});

app.use(errorHandler);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
