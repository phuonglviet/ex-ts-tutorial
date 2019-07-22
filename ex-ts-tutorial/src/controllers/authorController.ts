import { Request, Response, Router, NextFunction } from "express";
import * as async from "async";
import NotFoundException from "../exceptions/notFoundException"
import { Author } from "../models/author";
import { Book, IBook } from '../models/book';
import { Genre } from '../models/genre';
// const { check, body, validationResult } = require('express-validator');
const { check, body, validationResult } = require('express-validator');
// import { check } from "express-validator";
// import { check, body, validationResult } from "express-validator/check";
// import * as sanitizeBody from "express-validator";
// const sanitizeBody = require('express-validator');
// const { body, validationResult } = require('express-validator/check');
// const sanitizeBody = require('express-validator');
// import { check, body, validationResult } from "express-validator/check";
// import { check, body, validationResult } from "express-validator/check";
// import sanitizeBody = require('express-validator/filter');

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

    /*
    * Display Author create form on GET.
    */
    public authorCreateGet(req: Request, res: Response, next: NextFunction): void {
        res.render('author_form', { title: 'Create Author' });
    }

    /*
    * Handle Author create on POST.
    */
    public authorCreatePost(req: Request, res: Response, next: NextFunction): void {
        // Validate fields.
        check('first_name').isEmail();
        check('first_name', 'nhap mail').isEmail();
        check('first_name', 'con cat').isLength({ min: 10 });

        check('first_name').isLength({ min: 10 }).trim().escape().withMessage('First name must be specified.')
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.');
        body('first_name').isLength({ min: 10 }).trim().escape().withMessage('First name must be specified.')
             .isAlphanumeric().withMessage('First name has non-alphanumeric characters.');
        body('family_name').isLength({ min: 10 }).trim().withMessage('Family name must be specified.')
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.');
        body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601();
        body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601();

        // Sanitize fields.
        // sanitizeBody('first_name').escape();
        // sanitizeBody('family_name').escape();
        // sanitizeBody('date_of_birth').toDate();
        // sanitizeBody('date_of_death').toDate();

        // Process request after validation and sanitization.
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: author, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save author.
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }

}