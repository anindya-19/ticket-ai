import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(PORT, () => {
      console.log(`The server at http://localhost${PORT}`);
    });
  })
  .catch((err) => console.error(`MongooDB error: ${err}`));
