//Import the mongoose module
import * as mongoose from 'mongoose';

export class MongooseConn {

    /**
   * Constructor.
   *
   * @constructor
   */
    constructor() {
        // this.initConn();
    }

    public initConn(): void {
        //Set up default mongoose connection
        //var mongoDB = 'mongodb://127.0.0.1/my_database';
        // var mongoDB = 'mongodb+srv://phuong-dev:phuong-dev-123@cluster0-yeagy.mongodb.net/test?retryWrites=true';
        var mongoDB = process.env.MONGODB_CONNECTION;
        mongoose.connect(mongoDB, { useNewUrlParser: true });

        //Get the default connection
        var db = mongoose.connection;

        //Bind connection to error event (to get notification of connection errors)
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }
}