import { NextFunction, Request, Response, Router } from "express";
import { BaseRouter } from "./base"

export class IndexRouter extends BaseRouter {

  /**
 * Constructor
 *
 * @constructor
 */
  constructor() {
    super();
  }

  /**
   * Create routes.
   *
   * @override
   */
  public create(): Router {
    const router = Router();
    this.index(router);
    return router;
  }

  /**
   * Show home.
   *
   * @param router {Router} Express Router object.
   */
  private index(router: Router): void {

    /* GET home page. */
    router.get("/", (req: Request, res: Response, next: NextFunction) => {
      try {
        res.render("index", { title: "Express" });
        // res.redirect('/catalog');
      } catch (err) {
        next(err);
      }
    });
  }
}