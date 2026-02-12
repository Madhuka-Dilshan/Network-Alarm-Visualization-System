const express = require('express');
const router = express.Router();
const { addFaultNode ,getFaultyNodes,updateNode, deleteNode, getFaultsByNode,getStatusCount} = require('../controllers/faultController');

// Route to add a faulty node
router.post('/add-fault', addFaultNode);
router.get('/faulty-nodes', getFaultyNodes);
router.put('/nodes/:id', updateNode);
router.delete('/nodes/:id', deleteNode);
router.get('/nodes/:nodeName', getFaultsByNode);
router.get('/counts', getStatusCount);

module.exports = router;
