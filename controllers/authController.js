const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {
  //Verificar email
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // extraer email y password
  const { email, password } = req.body;
  try {
    // Revisar que el usuario este registrado
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }
    //Revisar password
    const passCorrect = await bcryptjs.compare(password, user.password);
    if (!passCorrect) {
      return res.status(400).json({ msg: 'Password incorrecto' });
    }

    // Si todo es correct crear y firmar el jwt
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600, //1hr,
      },
      (error, token) => {
        if (error) throw error;
        // Mensaje de confirmacion
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send('Hubo un error');
  }
};

// Obtiene que usuario esta auth
exports.userAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error' });
  }
};
