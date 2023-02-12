import { Router } from "express";
import ProductController from "../controllers/products_controller.js";
import UserController from "../controllers/users_controller.js";
const router = new Router();

router.post("/products/addToReview", ProductController.addToReview);
router.post("/products/getForReview", ProductController.getForReview);
router.post("/products/transferToMain", ProductController.transferToMain);
router.get("/products/getAll", ProductController.getAll);
router.post("/products/deleteFromReview", ProductController.deleteFromReview);

router.post("/users/add", UserController.registration);
router.post("/users/login", UserController.login);
router.get("/users/check", UserController.check);

export default router;