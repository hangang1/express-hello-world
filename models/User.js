const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://ldh9904:<db_password>@cluster0.lldi0.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB => UserAPI");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  user_id: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
