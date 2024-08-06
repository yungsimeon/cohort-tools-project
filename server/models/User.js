const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    unique: true,
    type: String,
  },

  password: {
    type: String,
  },

  name: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
