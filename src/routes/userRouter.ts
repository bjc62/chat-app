import { Router } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../connection/dataSource";

const router = Router();

router.get("/", async (req, res, next) => {
  console.log(`req.query: ${JSON.stringify(req.query)}`);

  const email = req.query.email as string;
  if (!email) {
    console.error("User email is required");
    res.status(400).json({ error: "User email is required" });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email: email });
    if (user) {
      res.send(user);
      return;
    } else {
      console.error(`User email not found: ${email}`);
      res.status(400).json({ error: `User email not found: ${email}` });
      return;
    }
  } catch (error) {
    console.error(`Unknown error: ${error}`);
    res.status(500).json({ error: `Unknown error: ${error}` });
    return;
  }
});

export default router;
