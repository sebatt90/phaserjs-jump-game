const express = require("express");
const app = express();
const PORT = 3050;

const path = require("path");

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.listen(PORT, ()=> console.log(`Listenting on port http://localhost:${PORT}`));