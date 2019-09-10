import { Request, Response, Router, NextFunction } from "express";
import * as async from "async";
import NotFoundException from "../exceptions/notFoundException"
import { Author } from "../models/author";
import { Book, IBook } from '../models/book';
import { Genre } from '../models/genre';
import { DateUtil } from "../util/dateUtil";
import { domainToASCII } from "url";
const { check, body, validationResult } = require('express-validator');

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
    * Handle Author create on POST Validate.
    */
    public authorCreateCheck = [
        // Validate fields.
        check('first_name').trim().escape().isLength({ min: 10 }).withMessage('First name must be specified.')
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
        check('family_name').trim().escape().isLength({ min: 10 }).withMessage('Family name must be specified.')
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
        check('date_of_birth', 'date of birth is required').not().isEmpty(),
        check('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
        check('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate()
    ];

    /*
     * Handle Author create on POST.
     */
    public authorCreatePost(req: Request, res: Response, next: NextFunction): void {

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

    /*
     * Display Author delete form on GET.
     */
    public authorDeleteGet(req: Request, res: Response, next: NextFunction): void {

        Author.findById(req.params.id).exec()
            .then(function (author) {
                Book.find({ 'author': req.params.id }).exec().then(function (books) {
                    res.render('author_delete', { title: 'Delete Author', author: author, author_books: books });
                });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
    * Handle Author delete on POST.
    */
    public authorDeletePost(req: Request, res: Response, next: NextFunction): void {

        Author.findById(req.body.authorid).exec()
            .then(function (author) {
                Book.find({ 'author': req.body.authorid }).exec().then(function (books) {
                    if (books.length > 0) {
                        // Author has books. Render in same way as for GET route.
                        res.render('author_delete', { title: 'Delete Author', author: author, author_books: books });
                        return;
                    }
                    else {
                        // Author has no books. Delete object and redirect to the list of authors.
                        Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                            if (err) { return next(err); }
                            // Success - go to author list.
                            // res.redirect('/catalog/authors')
                            res.redirect('/catalog')
                        })
                    }
                });
            })
            .catch(err => {
                //handle possible errors
                return next(err);
            });
    }

    /*
     * Handle Author update on GET.
     */
    public authorUpdateGet(req: Request, res: Response, next: NextFunction): void {

        Author.findById(req.params.id, function (err, author) {
            if (err) { return next(err); }
            if (author == null) { // No results.
                var error = new Error('Author not found');
                err.status = 404;
                return next(error);
            }
            // Success.
            res.render('author_form', { title: 'Update Author', author: author });
        });
    }

    /*
     * Handle Author update on POST.
     */
    public authorUpdatePost(req: Request, res: Response, next: NextFunction): void {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data (and the old id!)
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('author_form', { title: 'Update Author', author: author, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function (err, theauthor) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theauthor.url);
            });
        }
    }
}