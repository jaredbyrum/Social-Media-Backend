const { User, Thought } = require('../models');

module.exports = {
  // get all thoughts 
  async getThoughts (req, res) {
    try {
      const thoughtData = await Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .sort({ _id: -1 })
      res.status(200).json(thoughtData);  
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get thought by _id
  async getThoughtById (req, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.thoughtId })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .sort({ _id: -1 })

      if (!thoughtData) {
        return res.status(404).json({ message: 'No Thought found with that ID!' })
      }  
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // post new thought, push new _id to the users thoughts array
  async newThought (req, res) {
    try {
      const thoughtData = await Thought.create(req.body)
      const userData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }

      res.status(200).json(thoughtData)
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // put update a thought by _id
  async updateThought (req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      )

      if (!thoughtData) {
        return res.status(404).json({ message: 'No thought found with this ID' });
      }
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete thought by _id
  async deleteThought (req, res) {
    try {
      const thoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId })
      if (!thoughtData) {
        return res.status(404).json({ message: 'No thought found with this ID' });
      }
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // /api/thoughts/thought:id/reactions
  // post create a reaction to the associated thought, stored in the 'reactions' array
  async addReaction (req, res) {
    try {
      console.log('You are adding a reaction...');
      console.log(req.body);
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true }
      )

      if (!thoughtData) {
        return res.status(404).json({ message: "No thought found with that ID!" });
      }
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete pull and remove a reaction by its reactionId
  async deleteReaction (req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $pull: { reactions: { reactionId: req.body.reactionId } } },
        { runValidators: true, new: true }
      )

      if (!thoughtData) {
        return res.status(404).json({ message: 'No thought or reaction found with this ID!' });
      }
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  }

}