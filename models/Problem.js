const mongoose = require("mongoose");

  const ProblemSchema = new mongoose.Schema({
    title: {
      required: true,
      type: String,
    },
    completed_users: {
      required: true,
      type: Number,
    },
    difficulty_level: {
      required: true,
      type: Number,
    },
    description: {
      required: true,
      type: String,
    },
    tests: {
      required: true,
      type: Array,
    },
});

module.exports = mongoose.model("Problem", ProblemSchema);
