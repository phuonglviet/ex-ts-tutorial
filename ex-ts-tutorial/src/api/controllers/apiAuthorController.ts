import { Request, Response, Router, NextFunction } from "express";
import * as async from "async";
import NotFoundException from "../../exceptions/notFoundException"
import { Author } from "../../models/author";
import { Book, IBook } from '../../models/book';
import { Genre } from '../../models/genre';
import { DateUtil } from "../../util/dateUtil";
import { domainToASCII } from "url";
import { AuthorEntity } from "../../entity/authorEntity";
import { validate, validateOrReject } from "class-validator";
const { check, body, validationResult } = require('express-validator');

export class ApiAuthorController {

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
                //res.render('author_list', { title: 'Author List', authorList: listAuthors });
                //res.header('Content-Type', 'application/json; charset=utf-8')
                //res.status(400);
                res.send(listAuthors);
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
            //res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
            res.send({ author: results.author, author_books: results.authors_books });
        }
        );
    }

    /*
    * Handle Author create on POST Validate.
    */
    public authorCreateCheck = [
        // Validate fields.
        check('first_name').trim().escape().isLength({ min: 1 }).withMessage('First name must be specified.')
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
        check('family_name').trim().escape().isLength({ min: 1 }).withMessage('Family name must be specified.')
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
        check('date_of_birth', 'date of birth is required').not().isEmpty(),
        check('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
        check('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate()
    ];

    /*
     * Handle Author create on POST.
     * Way 1: with express validate check
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
                // res.redirect(author.url);
                return res.send({
                    success: 'true',
                    message: 'Insert author successfuly',
                });
            });
        }
    }

    /*
    * Handle Author create on POST Validate.
    * Way 2: with class_validator check
    */
    public authorCreateCheck_way_2(req: Request, res: Response, next: NextFunction): void {

        // Create Author object with escaped and trimmed data
        var authorEntity = new AuthorEntity(req.body.first_name,
            req.body.family_name,
            req.body.date_of_birth,
            req.body.date_of_death);

        // Create Author object with escaped and trimmed data
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }
        );

        validate(authorEntity).then(errors => { // errors is an array of validation errors
            if (errors.length > 0) {

                var errorsMsg: string[] = new Array();
                errors.forEach(function (error) {
                    // Object.keys(error.constraints).forEach((key) => { console.log(error.constraints[key]) });
                    Object.keys(error.constraints).forEach((key) => { errorsMsg.push(error.constraints[key]) });
                });

                // res.render('author_form', { title: 'Create Author', author: author, errors: errorsMsg });
                return res.status(400).send({
                    success: 'false',
                    message: 'Insert author failed.',
                    errors: errorsMsg
                });
            }
            else {
                next();
            }
        });

        // validateOrReject(authorEntity).catch(errors => {
        //     // There are errors. Render form again with sanitized values/errors messages.
        //     res.render('author_form', { title: 'Create Author', author: author, errors: errors });
        // });
    }

    /*
     * Handle Author create on POST.
     * Way 2: with class_validator check
     */
    public authorCreatePost_way_2(req: Request, res: Response, next: NextFunction): void {

        // Create Author object with escaped and trimmed data
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }
        );

        // Save author.
        author.save(function (err) {
            if (err) { return next(err); }
            // Successful - redirect to new author record.
            // res.redirect(author.url);
            return res.send({
                success: 'true',
                message: 'Insert author successfuly',
            });
        });
    }

    /*
     * Display Author delete form on GET.
     */
    public authorDeleteGet(req: Request, res: Response, next: NextFunction): void {

        Author.findById(req.params.id).exec()
            .then(function (author) {
                Book.find({ 'author': req.params.id }).exec().then(function (books) {
                    if (books.length > 0) {
                        // Author has books. Render in same way as for GET route.
                        return res.status(400).send({
                            success: 'false',
                            message: 'Delete author failed because author has books.',
                            author: author,
                            author_books: books
                        });
                    }
                    else {
                        // Author has no books. Delete object and redirect to the list of authors.
                        Author.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
                            if (err) {
                                //handle possible errors
                                return res.status(400).send({
                                    success: 'false',
                                    message: 'Delete author failed.',
                                    errors: err
                                });
                            }
                            // Success
                            return res.send({
                                success: 'true',
                                message: 'Delete author successfuly',
                            });
                        })
                    }
                });
            })
            .catch(err => {
                //handle possible errors
                return res.status(400).send({
                    success: 'false',
                    message: 'Delete author failed.',
                    errors: err
                });
            });
    }

    /*
     * Handle Author update on POST.
     */
    public authorUpdatePost(req: Request, res: Response, next: NextFunction): void {

        // Create Author object with escaped and trimmed data (and the old id!)
        var authorUpdate = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id
            }
        );

        Author.findById(req.params.id, function (err, author) {
            if (err) {
                //handle possible errors
                return res.status(400).send({
                    success: 'false',
                    message: 'Update author failed.',
                    errors: err
                });
            }
            if (author == null) { // No results.
                //handle possible errors
                return res.status(400).send({
                    success: 'false',
                    message: 'Author not found.'
                });
            }
            // Success.
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, authorUpdate, {}, function (err, theauthor) {
                if (err) {
                    //handle possible errors
                    return res.status(400).send({
                        success: 'false',
                        message: 'Update author failed.',
                        errors: err
                    });
                }
                // Success
                return res.send({
                    success: 'true',
                    message: 'Update author successfuly',
                });
            });
        });
    }
}