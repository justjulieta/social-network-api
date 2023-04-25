const { User, Thought } = require("../models");

module.exports = {
  getThoughts(req, res) {
    Thoughts.find({})
      .then((thought) => res.status(200).json(thought))
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "This thought does not match an ID!" })
          : res.status(200).json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "This thought does not match an ID!!" })
          : res.status(200).json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, New: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "This thought does not match an ID!" })
          : res.status(200).json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "This thought does not match an ID!" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) => {
        !user
          ? res.status(404).json({ message: 'This thought has been deleted but no user has been found'})
          : res.status(200).json({ message: 'This thought has been deleted' })
      })
      .catch((err) => res.status(500).json(err));
  },
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: "This thought does not match an ID!" })
          : res.status(200).json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
    .then((thought) => {
      !thought
        ? res.status(404).json({ message: "This thought does not match an ID!" })
        : res.status(200).json(thought)
    })
    .catch((err) => res.status(500).json(err));
  },
};