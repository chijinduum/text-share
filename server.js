const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const Document = require("./models/document");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/textshare", {
  useUnifiedTopology: true,
  useNewURLParser: true,
});

app.get("/", (req, res) => {
  const code = `Welcome to TextShare! 

Use the commands in the top right corner 
to create a new file to share with others`;
  res.render("code-display", { code, language: "plaintext" });
});

// page for adding text
app.get("/new", (req, res) => {
  res.render("new");
});

//page for saving text

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (e) {
    res.render("new", { value });
  }
  console.log(value);
});

//page for a duplicate to make further additions or corrections
app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);

    res.render("new", { value: document.value });
  } catch (e) {
    res.redirect(`/${id}`);
  }
});

//page to show saved document, differentiating between code and plain text
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);

    res.render("code-display", { code: document.value, id });
  } catch (e) {
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log(
    "App started on http://localhost: 3000; press Ctrl-C to terminate."
  );
});
