const express = require("express");
const app = express();
var cors = require('cors')
const port = 3001;
//Mengambil dari routes
const mangaDirektoriRouter = require('./routes/mangaDirektori')

app.use(cors())
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'))

//Menggunakan Routes yang di buat
app.use("/mangalist", mangaDirektoriRouter);
//error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
