import { Author } from "../models/author";
import * as express from "express";

export class AuthorController {

    /**
   * Constructor
   *
   * @constructor
   */
  constructor() {
    
  }

  public author_list(req: express.Request, res: express.Response, next: express.NextFunction):void {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('author_list', { title: 'Author List', author_list: list_authors });
        })
  }

}