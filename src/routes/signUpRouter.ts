import { Router } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../connection/dataSource";

const router = Router();

router.get("/", async (req, res, next) => {
  console.log("Inserting a new user into the database...");
  const user = new User();
  user.email = "lpaben63@gmail.com";
  const savedUser = await AppDataSource.manager.save(user);
  console.log(`finished saving user with email: ${savedUser.email}`);
  res.send(`finished saving user with email: ${savedUser.email}`);
});

export default router;
