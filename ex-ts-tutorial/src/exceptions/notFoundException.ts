import HttpException from "./httpException";

export default class NotFoundException extends HttpException {
    constructor(msg: string) {
        super(404, msg);
    }
}