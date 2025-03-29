
const pool = require('../config/db');

exports.getVisits = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM visits');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getVisitById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM visits WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener la visita:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createVisit = async (req, res) => {
  const { id, id_realstate, id_tenant, visit_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO visits (id, id_realstate, id_tenant, visit_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, id_realstate, id_tenant, visit_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear la visita:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateVisit = async (req, res) => {
  const id = req.params.id;
  const { id_realstate, id_tenant, visit_date } = req.body;
  try {
    const result = await pool.query(
      'UPDATE visits SET id_realstate = $1, id_tenant = $2, visit_date = $3 WHERE id = $4 RETURNING *',
      [id_realstate, id_tenant, visit_date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar la visita:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteVisit = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM visits WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Visita no encontrada' });
    }
    res.json({ message: 'Visita eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la visita:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
