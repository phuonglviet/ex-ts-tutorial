import { Schema, Document, Model, model } from 'mongoose';

export interface IGenre extends Document {
    name: string;
    url: string;
    checked: string;
}

var GenreSchema = new Schema({
    name: { type: String, required: true, min: 3, max: 100 }
});

// Virtual for this genre instance URL.
GenreSchema
    .virtual('url')
    .get(function () {
        return '/catalog/genre/' + this._id;
    });

// Virtual for this genre checked.
GenreSchema
    .virtual('checked')
    .get(function () {
        return 'false';
    });

export const Genre: Model<IGenre> = model<IGenre>('Genre', GenreSchema);