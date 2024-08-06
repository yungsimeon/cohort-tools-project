const mongoose = require("mongoose");
const { Schema } = mongoose;
const Cohort = require("./Cohort");

const studentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  linkedinUrl: {
    type: String,
    default: "",
  },

  languages: {
    type: [String],
    enum: [
      "English",
      "Spanish",
      "French",
      "German",
      "Portuguese",
      "Dutch",
      "Other",
    ],
  },

  program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
  },

  background: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "https://i.imgur.com/r8bo8u7.png",
  },
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cohort",
    required: true,
  },
  projects: {
    type: [],
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
