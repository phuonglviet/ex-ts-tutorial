import { Author } from "../models/author";
import * as express from "express";

export class AuthorController {

  // public router = express.Router();
  // public path = '/';
  

    /**
   * Constructor
   *
   * @constructor
   */
  constructor() {
    // this.intializeRoutes();
  }

  // public intializeRoutes() {
  //   this.router.get(this.path, this.author_list);
  // }

  public author_list(req: express.Request, res: express.Response, next: express.NextFunction):void {
    // Author.find()
    //     .sort([['family_name', 'ascending']])
    //     .exec(function (err, list_authors) {
    //         if (err) { return next(err); }
    //         // Successful, so render.
    //         res.render('author_list', { title: 'Author List', author_list: list_authors });
    //     })
    res.render("author_list", { title: "Express" });
  }

}