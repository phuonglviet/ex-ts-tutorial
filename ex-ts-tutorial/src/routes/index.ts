import { NextFunction, Request, Response, Router } from "express";

export const router: Router = Router();

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.render("index", { title: "Express" });
    // res.redirect('/catalog');
  } catch (err) {
    next(err);
  }
});

// export default router;
