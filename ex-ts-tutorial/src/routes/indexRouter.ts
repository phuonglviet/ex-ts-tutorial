import { Request, Response, Router, NextFunction } from "express";
import { BaseRouter } from "./baseRouter"
import * as express from 'express';

export class IndexRouter extends BaseRouter {

  public router = Router();
  //public router = express.Router();

  /**
 * Constructor
 *
 * @constructor
 */
  constructor() {
    super();
    this.intializeRoutes();
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

  //   /* GET home page. */
  //   router.get("/", (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       // res.render("index", { title: "Express" });
  //       res.redirect('/catalog');
  //     } catch (err) {
  //       next(err);
  //     }
  //   });
  // }

  /**
   * Create routes.
   *
   * @override
   */
  public intializeRoutes() {
    /* GET home page. */
    this.router.get("/", (req: Request, res: Response, next: NextFunction) => {
      // res.render("index", { title: "Express" });
      res.redirect('/catalog');
    });

  }
}