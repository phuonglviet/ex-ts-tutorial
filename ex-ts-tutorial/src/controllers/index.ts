import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./base";

/**
 * IndexController
 *
 * @class IndexController
 */
export class IndexController extends BaseController {

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
    router.get("/", (req: Request, res: Response, next: NextFunction) => {
      try {
        this.title = `Home | TODO`;
        this.render(req, res, "index");
        next();
      } catch (err) {
        next(err);
      }
    });
  }
}
