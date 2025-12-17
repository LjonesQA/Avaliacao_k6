const express = require('express');
const router = express.Router();
const transferService = require('../service/transferService');
const { authToken } = require('../middleware/authToken');

// POST /transfer - Cria uma nova transferência (protegida)
router.post('/', authToken, (req, res) => {
  try {
    const transfer = transferService.transferValue(req.body);
    res.status(201).json(transfer);
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
});

// GET /transfer - Lista todas as transferências (protegida)
router.get('/', authToken, (req, res) => {
  try {
    res.json(transferService.getTransfers());
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
});

module.exports = router;
