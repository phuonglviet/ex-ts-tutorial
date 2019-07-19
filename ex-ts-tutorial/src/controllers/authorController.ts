import { Request, Response, Router, NextFunction } from "express";
import * as async from "async";
import NotFoundException from "../exceptions/notFoundException"
import { Author } from "../models/author";
import { Book, IBook } from '../models/book';
import { Genre } from '../models/genre';

export class AuthorController {

    /**
     * Constructor
     *
     * @constructor
     */
    constructor() {
    }

    /*
    * Display list of all Authors.
    */
    public getAuthorList(req: Request, res: Response, next: NextFunction): void {

        Author.find()
            .sort([['family_name', 'ascending']])
            .exec(function (err, listAuthors) {
                if (err) { return next(err); }
                // Successful, so render.
                res.render('author_list', { title: 'Author List', authorList: listAuthors });
            })
    }

    /*
    * Display detail page for a specific Author.
    */
    public getAuthorDetail(req: Request, res: Response, next: NextFunction): void {
        async.parallel({
            author: function (callback) {
                Author.findById(req.params.id)
                    .exec(callback)
            },
             authors_books: function (callback) {
                Book.find({ 'author': req.params.id }, 'title summary')
                    .exec(callback)
            },
        }, function (err, results) {
            if (err) { return next(err); } // Error in API usage.
            if (results.author == null) { // No results.
                const id = req.params.id;
                var error = new NotFoundException('Author not found with id :' + id);
                return next(error);
            }
            // Successful, so render.
            res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
        }
        );
    }

}