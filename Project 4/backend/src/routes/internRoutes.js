const express = require('express');
const router = express.Router();
const { createIntern, getAllInterns, getInternById, updateIntern, deleteIntern } = require('../controllers/internController');

router.get('/',      getAllInterns);
router.post('/',     createIntern);
router.get('/:id',   getInternById);
router.put('/:id',   updateIntern);
router.delete('/:id',deleteIntern);

module.exports = router;
