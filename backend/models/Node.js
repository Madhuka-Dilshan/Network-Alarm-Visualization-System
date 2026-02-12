const mongoose = require('mongoose');

// Define the Node Schema
const nodeSchema = new mongoose.Schema({
    node: {
        type: String,
        required: true, // Root node name (e.g., MAY_C300M_03)
    },
    rack: {
        type: Number,
        required: true, // Rack number (integer)
    },
    shelf: {
        type: Number,
        required: true, // Shelf number (integer)
    },
    slot: {
        type: Number,
        required: true, // Slot number (integer)
    },
    port: {
        type: Number,
        required: true, // Port number (integer)
    },
    onu: {
        type: Number,
         // ONU number is not required (nullable)
    },
    status: {
        type: String,
        enum: ['fault', 'healthy'], // Node status: "fault" or "healthy"
        default: 'fault', // Default status is "fault" for faulty nodes
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the Node model
const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
