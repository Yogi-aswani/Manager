const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskName:{
        type:String,
        require:true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    submitDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);