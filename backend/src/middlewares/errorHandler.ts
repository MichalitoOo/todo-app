import AppError from '../utils/AppError';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error occurred:", err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message
        });
        return;
    }

    console.error("Unexpected non-operational server error:", err);
    res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Internal server error.'
    });
    return;
};

export default errorHandler;
