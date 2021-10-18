const express = require("express");
const port = 8081;
const app = express();

const server = app.listen(port, () =>
  console.log(`listening on http://localhost:${port}`)
);

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//esta linea es muy importante para enviar el body
app.use(express.urlencoded({ extended: true }));

const validations = require("./validators");

app.get("/", validations.validators("color", "query"), (req, res) => {
  res.render("index", { color: res.locals.value.color });
});

app.post("/orders", validations.validators("order", "body"), (req, res) => {
  if (res.locals.error == undefined) {
    res.render("success", { order: res.locals.value });
  } else {
    res.status(422).render("error", { details: res.locals.error.details });
  }
});
