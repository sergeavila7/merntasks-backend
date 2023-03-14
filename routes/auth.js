// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Iniciar sesión

// api/auth
router.post(
  '/',
  // [
  //   check('email', 'Agrega un email válido').isEmail(),
  //   check('password', 'El password debe ser minimo de 6 caracteres').isLength({
  //     min: 6,
  //   }),
  // ],
  authController.authenticateUser
);

// Obtiene el usuario auth
router.get('/', auth, authController.userAuth);

module.exports = router;
