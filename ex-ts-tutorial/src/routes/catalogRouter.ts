import { Request, Response, Router, NextFunction } from "express";
import * as express from 'express';
import { BaseRouter } from "./baseRouter"
import { AuthorController} from "../controllers/authorController"

export class CatalogRouter extends BaseRouter {

   // public router = Router();
   //public router = express.Router();
  // public path = '/';

    /**
 * Constructor
 *
 * @constructor
 */
  constructor() {
    super();
    this.intializeRoutes()
  }

  /**
   * Create routes.
   *
   * @override
   */
  // public create(): Router {
  //   const router = Router();
  //   this.index(router);
  //   return router;
  // }

  /**
   * Show home.
   *
   * @param router {Router} Express Router object.
   */
  // private index(router: Router): void {

  //   const authorController = new AuthorController();
    /* GET catalog page. */



    /* GET catalog page. */
    // router.get("/", (req: Request, res: Response, next: NextFunction) => {
    //     authorController.author_list(req, res, next);
    // try {
    //     res.render("author_list", authorController.author_list);
    //   } catch (err) {
    //     next(err);
    //   }
    // });
  // }

  /**
   * Create routes.
   *
   * @override
   */
  public intializeRoutes() {
    const authorController = new AuthorController();
    // GET catalog home page.
    this.router.get(this.path, authorController.author_list);
  }
}