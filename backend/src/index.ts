import express from "express";
const app = express();
const PORT = process.env.PORT || 4000;
import newsRouter from "./routes/news";
import sequelize from "./config/database";

app.use(express.json());

app.use("/news", newsRouter);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    app.get("/", (req, res) => {
      res.send("Node.js Backend is running!");
    });
  })
  .catch((error: Error) => {
    console.error("Unable to sync the database:", error);
  });
