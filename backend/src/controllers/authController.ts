import { Request, RequestHandler, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import AppError from '../utils/AppError';
import logger from '../utils/logger';

export const register: RequestHandler = async (req: Request, res: Response, next) => {
  logger.info("Incoming request to /register", { body: req.body });

  const { email, password } = req.body;
  if (!email || !password) {
    logger.error("Missing email or password.");
    throw new AppError(400, "Email and password are required.");
  }

  logger.info("Validating password length...");
  if (password.length > 32 || password.length < 6) {
    logger.error("Invalid password length.");
    throw new AppError(400, "Password must be between 6 and 32 characters long.");
  }

  logger.info("Validating email format and length...");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    logger.error("Invalid email format.");
    throw new AppError(400, "Invalid email format.");
  }

  if (email.length > 100) {
    logger.error("Email is too long.");
    throw new AppError(400, "Email must be at most 100 characters long.");
  }

  // call service for the rest of the logic
  try {
    const createdUser = await registerUser(email, password);
    logger.info("User registered successfully.");
    res.status(201).json({ message: 'User registered successfully.', user: createdUser });
  } catch (error: any) {
    logger.error("Error during registration", { error: error.message });
    next(error); // Pass the error to the error handling middleware
  }
};

export const login: RequestHandler = async (req: Request, res: Response, next) => {
  logger.info("Incoming request to /login", { body: req.body });
  const { email, password } = req.body;
  if (!email || !password) {
    logger.error("Missing email or password.");
    throw new AppError(400, "Email and password are required.");
  }

  logger.info("Validating email format and length...");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    logger.error("Invalid email format.");
    throw new AppError(400, "Invalid email or password.");
  }

  if (email.length > 100) {
    logger.error("Email is too long.");
    throw new AppError(400, "Invalid email or password.");
  }

  logger.info("Validating password length...");
  if (password.length > 32 || password.length < 6) {
    logger.error("Invalid password length.");
    throw new AppError(400, "Invalid email or password.");
  }

  try {
    const { token, user } = await loginUser(email, password);
    logger.info("Returning JWT token and user info..");
    res.status(200).json({ token, user });
  } catch (error: any) {
    logger.error("Error during login", { error: error.message });
    next(error); // Pass the error to the error handling middleware
  }
};