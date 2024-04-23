import express from 'express';
import { getCostByWorker, getCostByLocation } from '../controllers/laborCostController.js'

const router = express.Router();

router.get('/worker', getCostByWorker);
router.get('/location', getCostByLocation);

export default router;
