import { Log } from '../utils/logger.js';

export default function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const msg = err.message || 'internl server error';
    Log('backend', 'error', 'middleware', `err ${status}: ${msg}`);
    res.status(status).json({ error: msg });
}