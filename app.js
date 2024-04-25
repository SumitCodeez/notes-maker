const express = require("express");
const app = express();
app.set("view engine", "ejs");
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// <---------Home-------->

app.get("/", function (req, res) {
  var arr = [];

  fs.readdir(`./files`, function (err, files) {
    files.forEach(function (file) {
      var data = fs.readFileSync(`./files/${file}`, "utf-8");
      var createdOn = fs.statSync(`./files/${file}`).birthtime.toLocaleString();
      arr.push({
        name: path.parse(file).name,
        content: data,
        createdOn: createdOn,
      });
    });
    res.render("index", { arr });
  });
});

// <---------Create-------->

app.post("/create", function (req, res) {
  var fn = req.body.name.split(" ").join("") + ".txt";
  fs.writeFile(`./files/${fn}`, req.body.content, function (err) {
    if (err) return res.status(500).send(err);
    else res.redirect("/");
  });
});

// <---------Read-------->

app.get("/read/:filename", function (req, res) {
  const namefile = req.params.filename + ".txt";
  fs.readFile(`./files/${namefile}`, "utf-8", function (err, files) {
    if (err) return console.log(err);
    else
      res.render("read", { filestitle: req.params.filename, filedata: files });
  });
});

// <---------Edit-------->

app.get("/edit/:filename", function (req, res) {
  const editfile = req.params.filename + ".txt";
  fs.readFile(`./files/${editfile}`, "utf-8", function (err, files) {
    if (err) return console.log(err);
    else
      res.render("edit", { filestitle: req.params.filename, filedata: files });
  });
});

app.post("/edit/:filename", function (req, res) {
  var editfn = req.body.name.split(" ").join("") + ".txt";
  fs.writeFile(`./files/${editfn}`, req.body.content, function (err) {
    if (err) return res.status(500).send(err);
    else res.redirect("/");
  });
});
// <---------Delete-------->

app.get("/delete/:filename", function (req, res) {
  const deleteFile = req.params.filename + ".txt";
  fs.unlink(`./files/${deleteFile}`, function (err) {
    if (err) return console.log(err);
    res.redirect("/");
  });
});
app.listen(3000);
