import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import shorturlsRouter from './routes/shortUrlRoute.js';
import { handleRedirect } from './controllers/shortUrlController.js';
import errorHandler from './middleware/errorHandler.js';
import { Log } from './utils/logger.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// short urls api
app.use('/shorturls', shorturlsRouter);

// redirect api
app.get('/:code', handleRedirect);

// error middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
    Log('backend', 'info', 'route', `server started on ${PORT}`);
});
