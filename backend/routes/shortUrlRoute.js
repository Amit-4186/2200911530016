import express from 'express';
import { createShortUrl, getStats } from '../controllers/shorturlController.js';

const router = express.Router();

router.post('/', createShortUrl);
router.get('/:code', getStats);

export default router;
