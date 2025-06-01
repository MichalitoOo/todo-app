import { Request, RequestHandler, Response } from 'express';
import { authService } from '../services/authService'; // Adjust the import based on your project structure
// import jwt from 'jsonwebtoken';

export const register: RequestHandler = async (req: Request, res: Response, next) => {
  console.log("Incoming request to /register", req.body); // Log request body

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Missing email or password.");
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  console.log("Validating password length...");
  if (password.length > 18 || password.length < 6) {
    console.log("Invalid password length.");
    res.status(400).json({ error: "Password must be between 6 and 18 characters long." });
    return;
  }

  console.log("Validating email format and length...");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("Invalid email format.");
    res.status(400).json({ error: "Invalid email format." });
    return;
  }

  if (email.length > 100) {
    console.log("Email is too long.");
    res.status(400).json({ error: "Email must be at most 100 characters long." });
    return;
  }

  // call service for the rest of the logic
  try {
    const createdUser = await authService.registerUser(email, password);
    console.log("User registered successfully.");
    res.status(201).json({ message: 'User registered successfully.', user: createdUser });
  } catch (error: any) {
    console.error("Error during registration: ", error);
    next(error); // Pass the error to the error handling middleware
  }
};


// export const login: RequestHandler = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const user = await userRepository.findOneBy({ email }); // TypeORM
//     if (!user){
//       res.status(404).json({ error: 'User not found.' });
//       return;
//     } 

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       res.status(401).json({ error: 'Invalid credentials.' });
//       return;
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
//       expiresIn: '1h',
//     });
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: 'Error logging in.' });
//     return
//   }
// };

// export const home: RequestHandler = async (req: Request, res: Response) => {
//   res.status(200).json({ message: 'Welcome to the protected home page!', user: req.body.userId });
//   return;
// };