const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUSer = async (req, res) => {
  //Verificar email
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // extraer email y password
  const { email, password } = req.body;
  try {
    // Revisar que el usuario registrado sea unico
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }
    // Crea nuevo usuario
    user = new User(req.body);

    // Hashear el password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    // Guardar usuario
    await user.save();

    // Crear y firmar el jwt
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
