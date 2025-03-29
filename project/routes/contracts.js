
const express = require('express');
const router = express.Router();
const contractsController = require('../controllers/contractsController');

router.get('/', contractsController.getContracts);
router.get('/:id', contractsController.getContractById);
router.post('/', contractsController.createContract);
router.put('/:id', contractsController.updateContract);
router.delete('/:id', contractsController.deleteContract);

module.exports = router;
