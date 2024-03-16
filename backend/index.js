const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes/index");
const app = express();

app.use(express.json())
app.use(cors())

app.use("/api/v1", rootRouter);


app.listen(3000,(req,res)=>{
    console.log("Server is running at port 3000")
})


