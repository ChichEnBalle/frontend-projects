// set up ======================================================================
var http = require("http");
var express = require("express");
var app = express(); // create our app w/ express
var mongoose = require("mongoose"); // mongoose for mongodb
var cors = require("cors");

var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var path = require("path");

var port = 4000;

// configuration ===============================================================
mongoose.connect("mongodb+srv://baronnicolas12:ChichEnBalle@cluster0.cqdhzsi.mongodb.net/tododb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.error("Erreur MongoDB:", err)); // connect to mongoDB database on modulus.iox 

app.set("port", process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // set the static files location /public/img will be /img for users

// define model ================================================================
var Todo = mongoose.model("Todo", {
  text: String,
  done: Boolean
});

// routes ======================================================================
app.use(cors());

// api ---------------------------------------------------------------------
// get all todos
app.get("/api/todos", async function (req, res) {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error("Erreur dans GET /api/todos :", err);
    res.status(500).send(err);
  }
});

app.get("/api/todos/:todo_id", async function (req, res) {
  try {
    const todo = await Todo.find({ _id: req.params.todo_id });
    res.json(todo);
  } catch (err) {
    console.error("Erreur dans GET /api/todos/:todo_id :", err);
    res.status(500).send(err);
  }
});

// create todo and send back all todos after creation
app.post("/api/todos", async function (req, res) {
  try {
    await Todo.create({
      text: req.body.text,
      done: false
    });

    // get and return all the todos after you create another
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// app.put("/api/todos", function (req, res) {});
app.patch("/api/todos/:todo_id", async function (req, res) {
  try {
    await Todo.findByIdAndUpdate(req.params.todo_id, { done: req.body.done });
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});
// delete a todo
app.delete("/api/todos/:todo_id", async function (req, res) {
  try {
    await Todo.deleteOne({ _id: req.params.todo_id });
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

// listen (start app with node server.js) ======================================
var server = http.createServer(app);
server.listen(app.get("port"), function () {
  console.log("Express server listening on: http://localhost:" + app.get("port"));
});
