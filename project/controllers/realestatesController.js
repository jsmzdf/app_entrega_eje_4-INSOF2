
const pool = require('../config/db');
const crypto = require('crypto');

exports.getRealestates = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM realestates');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener inmuebles:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getRealestateById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM realestates WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inmueble no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el inmueble:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.createRealestate = async (req, res) => {
  const { id, status, address, city, state, price, id_owner } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO realestates (id, status, address, city, state, price, id_owner) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, status, address, city, state, price, id_owner]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el inmueble:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateRealestate = async (req, res) => {
  const id = req.params.id;
  const { status, address, city, state, price, id_owner } = req.body;
  try {
    const result = await pool.query(
      'UPDATE realestates SET status = $1, address = $2, city = $3, state = $4, price = $5, id_owner = $6 WHERE id = $7 RETURNING *',
      [status, address, city, state, price, id_owner, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inmueble no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el inmueble:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// controllers/realestatesController.js


// Obtener todos los inmuebles
exports.getRealestates = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM realestates');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener inmuebles:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Obtener un inmueble por id
exports.getRealestateById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM realestates WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inmueble no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el inmueble:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Crear un inmueble
exports.createRealestate = async (req, res) => {
  try {
    const { id, status, address, city, state, price, id_owner } = req.body;
    const result = await pool.query(
      'INSERT INTO realestates (id, status, address, city, state, price, id_owner) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, status, address, city, state, price, id_owner]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear el inmueble:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Actualizar un inmueble
exports.updateRealestate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, address, city, state, price, id_owner } = req.body;
    const result = await pool.query(
      'UPDATE realestates SET status = $1, address = $2, city = $3, state = $4, price = $5, id_owner = $6 WHERE id = $7 RETURNING *',
      [status, address, city, state, price, id_owner, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inmueble no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el inmueble:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
////////////////////////
// Eliminar un inmueble
exports.deleteRealestate = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM realestates WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inmueble no encontrado.' });
    }
    res.json({ message: 'Inmueble eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el inmueble:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



exports.signContract = async (req, res) => {
  try {
    const realstateId = req.params.id;
    const { id_tenant, start_date, end_date, monthly_amount } = req.body;

    // Verificar si el inmueble existe y si está disponible para arrendar
    const realstateRes = await pool.query('SELECT * FROM realestates WHERE id = $1', [realstateId]);
    if (realstateRes.rows.length === 0) {
      return res.status(404).json({
        message: 'Error: Inmueble no encontrado.',
        contract: null
      });
    }

    const realstate = realstateRes.rows[0];
    if (realstate.status === 'RENTED') {
      return res.status(400).json({
        message: 'Error: El inmueble ya está arrendado y no puede ser arrendado nuevamente.',
        contract: null
      });
    }

    // Convertir fechas a valores numéricos y calcular el código del contrato
    const startDateNumeric = parseInt(start_date.replace(/-/g, '')); // "2025-06-01" -> 20250601
    const endDateNumeric = parseInt(end_date.replace(/-/g, '')); // "2026-05-31" -> 20260531
    const codeContractValue = id_tenant + startDateNumeric + endDateNumeric;

    // Generar hash SHA-256 para el code_contract
    const hashedCodeContract = crypto.createHash('sha256').update(codeContractValue.toString()).digest('hex');

    // Verificar si ya existe un contrato con el mismo code_contract
    const existingContract = await pool.query(
      'SELECT * FROM contracts WHERE code_contract = $1',
      [hashedCodeContract]
    );
    if (existingContract.rows.length > 0) {
      return res.status(400).json({
        message: 'Error: El contrato para estas fechas y este inquilino ya existe.',
        contract: null
      });
    }

    // Generar nuevo ID para el contrato
    const idResult = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 AS new_id FROM contracts');
    const newId = idResult.rows[0].new_id;

    // Crear el contrato
    const contractRes = await pool.query(
      'INSERT INTO contracts (id, id_realstate, id_tenant, code_contract, start_date, end_date, monthly_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [newId, realstateId, id_tenant, hashedCodeContract, start_date, end_date, monthly_amount]
    );

    // Actualizar el estado del inmueble a RENTED
    await pool.query('UPDATE realestates SET status = $1 WHERE id = $2', ['RENTED', realstateId]);

    res.status(201).json({
      message: 'Contrato firmado exitosamente y el estado del inmueble actualizado a RENTED.',
      contract: contractRes.rows[0]
    });
  } catch (error) {
    console.error('Error inesperado:', error);
    res.status(500).json({
      message: 'Error interno del servidor.',
      contract: null
    });
  }
};
