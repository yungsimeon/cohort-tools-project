const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const router = express.Router();
const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;
  if (email === "" || password === "" || name === "") {
    res
      .status(400)
      .json({ message: "You must provide an email, password and name" });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({ email, password: hashedPassword, name });
    })
    .then((createdUser) => {
      const { email, _id, name } = createdUser;
      const user = { email, name, _id };
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "Internal Server Error" });
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).json({ message: "You must provide an email and password" });
    return;
  }
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(400).json({ message: "User doesnt exist" });
        return;
      }
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      if (!passwordCorrect) {
        res.status(401).json({ message: "incorrect password" });
        return;
      } else {
        const { email, _id, name } = foundUser;
        const payload = { email, _id, name };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({ authToken: authToken });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });

  router.get("/verify", isAuthenticated, (req, res, next) => {
    console.log(`req.payload`, req.payload);
    res.status(200).json(req.payload);
  });
});

module.exports = router;
