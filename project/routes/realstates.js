const express = require('express');
const router = express.Router();
const realestatesController = require('../controllers/realestatesController');

// Rutas CRUD básicas para inmuebles
router.get('/', realestatesController.getRealestates);
router.get('/:id', realestatesController.getRealestateById);
router.post('/', realestatesController.createRealestate);
router.put('/:id', realestatesController.updateRealestate);
router.delete('/:id', realestatesController.deleteRealestate);

// Endpoint para firmar un contrato para un inmueble específico
router.post('/:id/sign_contract', realestatesController.signContract);

module.exports = router;