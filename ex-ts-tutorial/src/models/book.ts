import { Schema, Document, Model, model } from 'mongoose';
import { IAuthor } from './author';
import { IGenre } from './genre';

export interface IBook extends Document {
    title: String;
    author: IAuthor['_id'];
    summary: String;
    isbn: String;
    genre: IGenre['_id'];
}

var BookSchema = new Schema(
    {
        title: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
        // author: { type: Schema.Types.ObjectId, required: true },
        summary: { type: String, required: true },
        isbn: { type: String, required: true },
        genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }]
        // genre: [{ type: Schema.Types.ObjectId}]
    }
);

// Virtual for book's URL
BookSchema
    .virtual('url')
    .get(function () {
        return '/catalog/book/' + this._id;
    });

export const Book: Model<IBook> = model<IBook>('Author', BookSchema);