import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote, } from  "../Controller/noteController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
