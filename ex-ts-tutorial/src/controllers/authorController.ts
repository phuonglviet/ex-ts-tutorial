import { Request, Response, Router, NextFunction } from "express";
import { Author } from "../models/author";

export class AuthorController {

  /**
   * Constructor
   *
   * @constructor
   */
  constructor() {
  }

  public getAuthorList(req: Request, res: Response, next: NextFunction):void {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('author_list', { title: 'Author List', authorList: list_authors });
        })
  }

}