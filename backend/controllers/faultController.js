const mongoose = require('mongoose');
const Node = require('../models/Node'); // Import the Node model

// Add a faulty node (only faulty nodes are considered)
async function addFaultNode(req, res) {
    try {
        const { node, rack, shelf, slot, port, onu, status } = req.body;

        // Validate required fields: node, rack, shelf, slot, port are required
        if (!node || !rack || !shelf || !slot || !port) {
            return res.status(400).json({ message: 'Node, rack, shelf, slot, and port are required' });
        }

        // Prepare the query object to find the existing node
        const query = { node, rack, shelf, slot, port };
        if (onu !== undefined && onu !== null) {
            query.onu = onu; // Include ONU in the query if provided
        } else {
            query.onu = null; // Explicitly search for nodes where ONU is null
        }

        // Check if the node already exists
        let existingNode = await Node.findOne(query);

        if (!existingNode) {
            // Create a new node
            const newNode = new Node({
                node,
                rack,
                shelf,
                slot,
                port,
                onu: onu !== undefined ? onu : null, // Set ONU if provided, otherwise null
                status: status || 'fault', // Default to 'fault'
            });
            await newNode.save();

            return res.status(201).json({
                message: 'Faulty node added successfully',
                node: newNode,
            });
        } else if (existingNode.status === 'fault') {
            // If the node already exists with the same fault status, prevent duplicate addition
            return res.status(409).json({
                message: 'Faulty node already exists with the same status',
            });
        } else {
            // Update the existing node's status if different
            existingNode.status = 'fault'; // Ensure status is 'fault'
            await existingNode.save();

            return res.status(200).json({
                message: 'Faulty node updated successfully',
                node: existingNode,
            });
        }
    } catch (err) {
        console.error('Error while adding faulty node:', err);
        return res.status(500).json({ message: 'Error while adding faulty node' });
    }
}


// Fetch all faulty nodes
async function getFaultyNodes(req, res) {
    try {
        // Find all nodes with status "fault"
        const faultyNodes = await Node.find({ status: 'fault' });

        return res.status(200).json({
            message: 'Faulty nodes retrieved successfully',
            nodes: faultyNodes, // Return all the faulty nodes
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error while retrieving faulty nodes' });
    }
}

// Get all faults for a specific node
async function getFaultsByNode(req, res) {
    try {
        const { nodeName } = req.params; // Extract the node name from request parameters

        // Find all nodes related to the given node name that have a 'fault' status
        const faults = await Node.find({ node: nodeName, status: 'fault' });

        // Check if any faults were found
        if (!faults || faults.length === 0) {
            return res.status(404).json({ message: `No faults found for node: ${nodeName}` });
        }

        // Return the list of faults for the node
        return res.status(200).json({
            message: 'Faults found for node',
            faults: faults, // Send back all the faults
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching faults for the node' });
    }
}


// Update a node
async function updateNode(req, res) {
    try {
        const { id } = req.params; // Get the ID from request parameters

        // Validate if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const updateData = req.body; // Get fields to update

        // Find and update the node
        const node = await Node.findByIdAndUpdate(id, updateData, { new: true });

        if (!node) {
            return res.status(404).json({ message: 'Node not found' });
        }

        return res.status(200).json({
            message: 'Node updated successfully',
            node,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error while updating the node' });
    }
}

// Delete a node by ID
async function deleteNode(req, res) {
    try {
        const { id } = req.params; // Extract the ID from request parameters

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Node ID format' });
        }

        // Attempt to delete the node
        const deletedNode = await Node.findByIdAndDelete(id);

        // Check if the node was found and deleted
        if (!deletedNode) {
            return res.status(404).json({ message: 'Node not found' });
        }

        // Return a success message
        return res.status(200).json({
            message: 'Node deleted successfully',
            node: deletedNode, // Optionally, return the deleted node
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error deleting node' });
    }
}



// // Get distinct fault node names
// async function getStatusCount(req, res) {
//     try {
//         // Get distinct fault node names
//         const distinctFaultNodes = await Node.distinct('node', { status: 'fault' });

//         // Respond with the distinct fault node names
//         res.status(200).json({
//             message: 'Distinct fault nodes retrieved successfully',
//             faultNodes: distinctFaultNodes,
//         });
//     } catch (error) {
//         console.error('Error fetching distinct fault nodes:', error);
//         res.status(500).json({ message: 'Error fetching distinct fault nodes' });
//     }
// }


async function getStatusCount(req, res) {
    try {
        // Get distinct fault node names
        const faultNodes = await Node.distinct('node', { status: 'fault' });

        // Get distinct healthy node names
        const healthyNodes = await Node.distinct('node', { status: 'non-fault' });

        // Respond with both healthy and fault nodes
        res.status(200).json({
            message: 'Node status counts retrieved successfully',
            healthyNodes,
            faultNodes,
        });
    } catch (error) {
        console.error('Error fetching node status:', error);
        res.status(500).json({ message: 'Error fetching node status' });
    }
}





module.exports = {
    addFaultNode,
    getFaultyNodes,
    getFaultsByNode,
    updateNode,
    deleteNode,
    getStatusCount,
};
