import { Router } from "express";
import { contact } from "../controllers/contact.mjs"

const router = Router();

router.post("/new-contact", contact);

export default router;
