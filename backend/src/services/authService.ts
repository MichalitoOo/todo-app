import { User } from '../models/User';
import { AppDataSource } from '../app'; // Adjust based on your setup
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError';
import { sign } from 'jsonwebtoken';



export const registerUser = async (email: string, password: string) => {
    console.log("Starting user registration...");
    
    // Validate the user does not already exist
    console.log("Checking if user already exists...");

    const userRepository = AppDataSource.getRepository(User);
    const userExists = await userRepository.findOneBy({ email });
    if (userExists) {
        console.log("User already exists with this email:", email);
        throw new AppError(400, "User with this email already exists.");
    }


    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully.");

    console.log("Creating new user...");
    const newUser = userRepository.create({ email, password: hashedPassword });
    const createdUser = await userRepository.save(newUser);
    console.log("User created successfully.");
    // return the created user
    return {
        id: createdUser.id,
        email: createdUser.email
    };
};


export const loginUser = async (email: string, password: string) => {
    console.log("Starting user login...");

    // Validate the user exists
    console.log("Checking if user exists...");
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });
    if (!user) {
        console.log("No user found with this email:", email);
        throw new AppError(401, "Invalid email or password.");
    }

    console.log("Validating password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log("Invalid password for user:", email);
        throw new AppError(401, "Invalid email or password.");
    }

    const payload = {
    userId: user.id,
    email: user.email
    };

    console.log("Login successful.. creating JWT token and user info..");
    const token = sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '1h' // Adjust the expiration time as needed
    });
    return { token, user: { id: user.id, email: user.email } };
}
