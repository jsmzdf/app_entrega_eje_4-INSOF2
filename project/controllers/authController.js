
const pool = require('../config/db');
const jwt =  require('jsonwebtoken');

const SECRET = 'secretKey'; // En producción, usa variables de entorno

// Registro: asume que los usuarios se registran como TENANT de manera predeterminada.
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validar que el rol sea válido (OWNER o TENANT)
    const validRoles = ['OWNER', 'TENANT'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'El rol debe ser OWNER o TENANT' });
    }

    // Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }

    // Generar un nuevo ID para el usuario
    const idResult = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 AS new_id FROM users');
    const newId = idResult.rows[0].new_id;

    // Insertar el nuevo usuario
    const result = await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newId, name, email, password, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Login: compara el email y la contraseña, y emite un token JWT si son válidos.
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
 
    if (result.rows.length === 0) {
      return res.status(400).json({ error: '-Credenciales inválidas.' });
    }
    const user = result.rows[0];
    console.log(user);
     console.log(user.password);
     console.log(password);
     console.log(typeof user.password);
console.log(typeof password);

    if (user.password.trim() !== password.trim()) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    // Genera el token JWT con datos básicos
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
