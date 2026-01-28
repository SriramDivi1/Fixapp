export const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
export const notFound = (req, res, next) => {
    const error = createError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    // Log error details
    console.error('Error:', {
        message: err.message,
        statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    // Handle specific error types
    if (err.message.includes('duplicate key')) {
        statusCode = 409;
        message = 'Resource already exists';
    }
    if (err.message.includes('not found')) {
        statusCode = 404;
        message = 'Resource not found';
    }
    if (err.message.includes('validation failed')) {
        statusCode = 400;
        message = 'Invalid input data';
    }
    // Don't leak error details in production
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        message = 'Something went wrong';
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    });
};
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=errorHandler.js.map