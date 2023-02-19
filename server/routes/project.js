const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const Risk = require("../models/risk");

// Creating a new project
router.post("/create", async (req, res) => {
  const project = new Project({
    uid: req.body.uid,
    projectName: req.body.projectName,
  });
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Getting all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Deleting a project based on pid and its risk table
router.delete("/:id", getProject, async (req, res) => {
  try {
    // remove all risks that have this project ID
    await Risk.deleteMany({ pid: req.params.id });
    await res.project.remove();
    res.json({ message: "Project and its risk table are deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getProject(req, res, next) {
  let project;
  try {
    project = await Project.findById(req.params.id);
    if (project == null) {
      return res.status(400).json({ message: "Cannot find project" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.project = project;
  next();
}

module.exports = router;
