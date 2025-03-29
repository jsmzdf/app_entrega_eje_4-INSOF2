
const pool = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Users"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM "Users" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createUser = async (req, res) => {
  const { id, name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "Users" (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, email, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      'UPDATE "Users" SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *',
      [name, email, password, role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM "Users" WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
