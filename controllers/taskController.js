const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Crea una nueva tarea
exports.createTask = async (req, res) => {
  // Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extraer proyecto y comprobar si existe
    const { project } = req.body;
    const existProject = await Project.findById(project);
    if (!existProject) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }

    // Creamos la tarea
    const task = new Task(req.body);
    await task.save();
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

exports.getTasks = async (req, res) => {
  // Extraer proyecto y comprobar si existe
  try {
    const { project } = req.query;
    const existProject = await Project.findById(project);
    if (!existProject) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' });
    }

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }

    // Obtener las tareas por proyecto
    const tasks = await Task.find({ project }).sort({ create: -1 });
    res.json({ tasks });
  } catch {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { project, name, state } = req.body;

    // Si la tarea existe o no
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'No existe esa tarea' });
    }

    // Extraer proyecto
    const existProject = await Project.findById(project);

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }

    // Crear objeto con la nueva información
    const newTask = {};
    newTask.name = name;
    newTask.state = state;

    // Guardar la tarea
    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true,
    });
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query;

    // Si la tarea existe o no
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'No existe esa tarea' });
    }

    // Extraer proyecto
    const existProject = await Project.findById(project);

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (existProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'No Autorizado' });
    }

    // Eliminar
    await Task.findByIdAndRemove({ _id: req.params.id });
    res.json({ msg: 'Tarea Eliminada' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};
