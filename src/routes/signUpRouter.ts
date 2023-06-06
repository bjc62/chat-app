import { Router } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../connection/dataSource";

const router = Router();

router.get("/", async (req, res, next) => {
  const user = new User("lpaben63@gmail.com");
  const savedUser = await AppDataSource.manager.save(user);
  console.log(`finished saving user with email: ${savedUser.email}`);
  res.send(`finished saving user with email: ${savedUser.email}`);
});

export default router;
