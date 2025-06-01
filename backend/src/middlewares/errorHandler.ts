import { ErrorRequestHandler } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error occurred:", err);
    
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message
        });
    }

    // If the error is not an instance of AppError, it's not operational error, but rather an unexpected error
    console.error("Unexpected non-operational server error:");
    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Internal server error.'
    });
};

export default errorHandler;
