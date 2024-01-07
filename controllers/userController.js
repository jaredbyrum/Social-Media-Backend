const { User, Thought } = require('../models');

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' })

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // post a new user
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // put update a user by its _id
  async updateUser(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: "No user found!" });
      }

      res.status(200).json("Updated user")
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete user by _id 
  // BONUS: delete users associated thoughts when deleted
  async deleteUser(req, res) {
    try {
      const userData = await User.findOneAndDelete(
        { _id: req.params.userId }
      )
      if (!userData) {
        return res.status(404).json({ message: "No user with this id!" });
      }
      
      await Thought.deleteMany({ _id: { $in: userData.thoughts}});
      res.json({ message: 'User and Thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // /api/users/:userID/friends/:friendsId
  // post add a new friend to friends list 
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendsId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with this username!" });
      }
      res.json(user);  
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete a friend from list by _id
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendsId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with this username!" })
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }

}