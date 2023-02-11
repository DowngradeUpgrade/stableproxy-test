import { Router } from "express";
const router = new Router();

router.get("/products", (req, res) => {
  res.json({ message: "Hello World!" });
});
