import express from 'express';
import { 
  getThoughts, 
  createThought,
  getThoughtById,
  updateThought,
  deleteThought,
  toggleFavorite,
  getFavorites,
  getStats
} from '../controllers/thoughtController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// PROTECT ALL ROUTES - This is critical!
router.use(protect);

router.get('/favorites/all', getFavorites);
router.get('/stats/summary', getStats);

router.route('/')
  .get(getThoughts)
  .post(createThought);

router.patch('/:id/favorite', toggleFavorite);

router.route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

export default router;