import { Request, Response } from 'express';
import { AppDataSource } from '../app';
import { Task } from '../models/Task';
import { TaskStatus, TaskPriority } from '../models/Task';  

const taskRepository: any = AppDataSource.getRepository(Task);

export const createTask = async (req: Request, res: Response) => {
    const { title, description, status, priority } = req.body;
    const userId = req.user.id; // from authMiddleware
}