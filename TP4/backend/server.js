// set up ======================================================================
const http = require("http");
const express = require("express");
const app = express(); // create our app w/ express
const mongoose = require("mongoose"); // mongoose for mongodb
const cors = require("cors");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");

const port = 4000;

// configuration ===============================================================
mongoose.connect("mongodb+srv://baronnicolas12:ChichEnBalle@cluster0.cqdhzsi.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.error("Erreur MongoDB:", err)); // connect to mongoDB database

app.set("port", process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // set the static files location

// define model ================================================================
const Todo = mongoose.model("Todo", {
  text: String,
  done: Boolean
});

// routes ======================================================================
app.use(cors());

// api ---------------------------------------------------------------------
// get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get one todo by id
app.get("/api/todos/:todo_id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todo_id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

// create todo and send back all todos after creation
app.post("/api/todos", async (req, res) => {
  try {
    await Todo.create({
      text: req.body.text,
      done: false
    });
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete a todo
app.delete("/api/todos/:todo_id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.todo_id);
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update a todo
app.put('/api/todos/:todo_id', async (req, res) => {
  try {
    await Todo.findByIdAndUpdate(
      req.params.todo_id,
      { $set: { done: req.body.done, text: req.body.text } },
      { new: true }
    );
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch("/api/todos/:todo_id", async (req, res) => {
  try {
    await Todo.findByIdAndUpdate(
      req.params.todo_id,
      { $set: req.body },
      { new: true }
    );
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// application -------------------------------------------------------------
// catch-all pour SPA/front
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// listen (start app with node server.js) ======================================
const server = http.createServer(app);
server.listen(app.get("port"), function () {
  console.log("Express server listening on: http://localhost:" + app.get("port"));
});