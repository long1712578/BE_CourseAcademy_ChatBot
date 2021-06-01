const AppError = require('./../utils/app_error');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    // console.log(value);
    const message = `Duplicate field value ${value}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const value = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${value.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = () =>
    new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
    // console.log(req.originalUrl, req.url);
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // B) RENDERED WEBSITE
    // 1) Log error
    console.log('Error 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message
    });
};

const sendErrorProd = (err, req, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        // A) API
        if (req.originalUrl.startsWith('/api')) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }

        // B) RENDERED WEBSITE
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message
        });
    }

    // Programming or other unknown error: Don't leak error details
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: 'Some thing went wrong!'
        });
    }

    // B) RENDERED WEBSITE
    // 1) Log error
    console.log('Error 💥', err);
    // 2) Send generic message
    return res.status(500).json({
        title: 'Something went wrong',
        msg: 'Please try again later!'
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.log(err.stack);

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);

        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleTokenExpiredError();

        sendErrorProd(error, req, res);
    }
};