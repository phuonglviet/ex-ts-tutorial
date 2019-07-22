import { Schema, Document, Model, model } from 'mongoose';
import { IAuthor } from './author';
import { IGenre } from './genre';

export interface IBook extends Document {
    title: string;
    author: IAuthor['_id'];
    summary: string;
    isbn: string;
    genre: IGenre['_id'];
}

var BookSchema = new Schema(
    {
        title: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
        summary: { type: String, required: true },
        isbn: { type: String, required: true },
        genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }]
    }
);

// Virtual for book's URL
BookSchema
    .virtual('url')
    .get(function () {
        return '/catalog/book/' + this._id;
    });

export const Book: Model<IBook> = model<IBook>('Book', BookSchema);