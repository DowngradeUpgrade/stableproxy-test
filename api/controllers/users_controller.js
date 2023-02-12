import UsersModel from "../models/users_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class UsersController {
  async registration(req, res, next) {
    try {
      const { login, password, role } = req.body;
      const candidate = await UsersModel.getUserByLogin(login);
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with this login already exists" });
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const userData = await UsersModel.addUser(login, hashPassword, role);

      return res.json(userData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { login, password } = req.body;
      const user = await UsersModel.getUserByLogin(login);
      if (!user) {
        return res
          .status(400)
          .json({ message: "User with this login not found" });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const token = jwt.sign(
        { id: user.id, login: user.login, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      await UsersModel.setJwtToken(user.login, token);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.json({ token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async check(req, res, next) {
    try {
      try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const user = jwt.verify(token, process.env.SECRET_KEY);
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const tokenFromDb = await UsersModel.getJwtToken(user.login);

        if (token !== tokenFromDb) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        return res.json(user);
      } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (err) {
      next(err);
    }
  }
}

export default new UsersController();
