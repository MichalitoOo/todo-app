import { User } from '../models/User';
import { AppDataSource } from '../app'; // Adjust based on your setup
import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError';


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
