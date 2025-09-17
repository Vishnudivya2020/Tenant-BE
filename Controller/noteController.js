

import Note from "../models/Note.js";
import Tenant from "../models/Tenant.js";

// Create a note
export const createNote = async (req, res) => {
  try {
    // const tenant = await Tenant.findById(req.user.tenant._id);
    const tenant =req.user.tenant;
    const noteCount = await Note.countDocuments({ tenant: tenant._id });

    // Check subscription limit
    if (tenant.plan === "free" && noteCount >= 3) {
      return res
        .status(403)
        .json({ message: "Upgrade to Pro to add more notes" });
    }

    const note = await Note.create({
      title: req.body.title || "Untitled",
      content: req.body.content,
      tenant: tenant._id,
      createdBy: req.user._id,
    });

    res.json({ note }); // ✅ wrap in { note }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenant._id);
    const notes = await Note.find({ tenant: tenant._id });

    res.json({
      notes,
      tenantPlan: tenant.plan, // ✅ send plan too
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single note
export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      tenant: req.user.tenant._id,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenant: req.user.tenant._id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      tenant: req.user.tenant._id,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



