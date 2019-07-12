import { Request, Response, Router, NextFunction } from "express";
import { BaseRouter } from "./baseRouter"
import { AuthorController} from "../controllers/authorController"

export class CatalogRouter extends BaseRouter {

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

    const authorController = new AuthorController();
    


    /* GET catalog page. */
    router.get("/", (req: Request, res: Response, next: NextFunction) => {
        authorController.author_list(req, res, next);
    // try {
    //     res.render("author_list", authorController.author_list);
    //   } catch (err) {
    //     next(err);
    //   }
    });
  }
}