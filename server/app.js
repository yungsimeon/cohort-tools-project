require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const dbURI = process.env.MONGO_URI;
const cohortsData = require("./cohorts.json");
const studentsData = require("./students.json");
const cors = require("cors");
const Cohort = require("./models/Cohort");
const Student = require("./models/Student");
const User = require("./models/User");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");
const { isAuthenticated } = require("./middleware/jwt.middleware");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
app.use(cors());

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

const MONGODB_URI = "mongodb://127.0.0.1:27017/cohort-tools-project";
mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.post("/api/cohorts", (req, res) => {
  Cohort.create({ ...req.body })
    .then((createdCohort) => {
      res.status(200).json(createdCohort);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      res.status(200).json(cohorts);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/cohorts/:id", (req, res) => {
  const cohortId = req.params.id;
  Cohort.findById(cohortId)
    .then((cohort) => {
      res.status(200).json(cohort);
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/cohorts/:id", (req, res) => {
  const cohortId = req.params.id;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort);
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/cohorts/:id", (req, res) => {
  const cohortId = req.params.id;
  Cohort.findByIdAndDelete(cohortId)
    .then((deletedCohort) => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
});

app.post("/api/students", (req, res) => {
  Student.create({ ...req.body })
    .then((newStudent) => {
      res.status(201).json(newStudent);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/students/:id", (req, res) => {
  const studentId = req.params.id;
  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.status(200).json(student);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/students/cohort/:id", (req, res) => {
  const cohortId = req.params.id;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((cohortStudents) => {
      res.status(200).json(cohortStudents);
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/students/:id", (req, res) => {
  const studentId = req.params.id;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/students/:id", (req, res) => {
  const studentId = req.params.id;
  Student.findByIdAndDelete(studentId)
    .then((deletedStudent) => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/api/users/:id", isAuthenticated, (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    });
});

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
