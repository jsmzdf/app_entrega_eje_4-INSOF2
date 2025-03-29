
const pool = require('../config/db');

exports.getContracts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contracts');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener contratos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getContractById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createContract = async (req, res) => {
  const { id, id_realstate, id_tenant, code_contract, start_date, end_date, monthly_amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO contracts (id, id_realstate, id_tenant, code_contract, start_date, end_date, monthly_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, id_realstate, id_tenant, code_contract, start_date, end_date, monthly_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateContract = async (req, res) => {
  const id = req.params.id;
  const { id_realstate, id_tenant, code_contract, start_date, end_date, monthly_amount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE contracts SET id_realstate = $1, id_tenant = $2, code_contract = $3, start_date = $4, end_date = $5, monthly_amount = $6 WHERE id = $7 RETURNING *',
      [id_realstate, id_tenant, code_contract, start_date, end_date, monthly_amount, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteContract = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM contracts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    res.json({ message: 'Contrato eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

