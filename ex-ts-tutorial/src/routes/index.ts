import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.render("index", { title: "Express" });
  } catch (err) {
    next(err);
  }
});

export default router;
