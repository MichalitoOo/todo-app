import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../app'; // Adjust based on your setup
import { User } from '../models/User'; // Adjust based on your setup

const userRepository: any = AppDataSource.getRepository(User);

export const register: RequestHandler = async (req: Request, res: Response) => {
  console.log("Incoming request to /register", req.body); // Log request body

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Missing email or password.");
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed:", hashedPassword);

    console.log("Creating user...");
    const user = userRepository.create({ email, password: hashedPassword });
    console.log("User created (before saving):", user);

    await userRepository.save(user);
    console.log("User saved successfully.");

    res.status(201).json({ message: "User registered successfully." });
    return;
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Error registering user." });
    return;
  }
};


export const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findOneBy({ email }); // TypeORM
    if (!user){
      res.status(404).json({ error: 'User not found.' });
      return;
    } 

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in.' });
    return
  }
};

export const home: RequestHandler = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the protected home page!', user: req.body.userId });
  return;
};