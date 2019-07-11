import { NextFunction, Request, Response, Router } from "express";
import { AuthorController} from "../controllers/authorController"

const router: Router = Router();
const authorController = new AuthorController();

// GET catalog home page.
router.get('/', authorController.author_list);

export default router;