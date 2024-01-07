const router = require('express').Router();

const {
  getThoughts,
  getThoughtById,
  newThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(newThought);

router.route('/:thoughtId').get(getThoughtById).put(updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction).delete(deleteReaction);

module.exports = router;