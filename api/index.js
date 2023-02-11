import Express from "express";
import Cors from "cors";
import Dotenv from "dotenv";
import routes from "./routes/index";

const app = Express();
app.use(Express.json());
app.use(Cors());

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server has been started on port ${PORT}...`)
);
