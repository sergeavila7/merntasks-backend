const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crear una tarea
//api/tasks

router.post(
  '/',
  auth,
  [
    check('name', 'El Nombre es obligatorio').not().isEmpty(),
    check('project', 'El Projecto es obligatorio').not().isEmpty(),
  ],
  taskController.createTask
);

router.get('/', auth, taskController.getTasks);

// Actualizar tarea
router.put('/:id', auth, taskController.updateTask);

// Eliminar tarea
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
