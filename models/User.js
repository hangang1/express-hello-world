const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://ldh9904:europe99!!@cluster0.lldi0.mongodb.net/1")
  .then(() => {
    console.log("Connected to MongoDB => UserAPI");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new Schema({
	username: {type: String, required: true},
	password: {type: String},
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
