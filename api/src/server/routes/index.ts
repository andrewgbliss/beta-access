import express from 'express';
import ApiRoutes from './api';

const router = express.Router();

router.use('/api', ApiRoutes);

export default router;
