const express = require("express");
const ConnectDB = require("./config/db");
const cors = require("cors");
const { engine } = require("express-handlebars");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("./controllers/UserController");

const PORT = process.env.PORT || 8000;

const app = express();

ConnectDB();

app.use(express.json());
app.use(cors());

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home", { title: "Auth API", message: "welcome" });
});

app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);
app.post("/api/auth/forgot-password", forgotPassword);
app.post("/api/auth/reset-password/:token", resetPassword);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
