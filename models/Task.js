const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: 'User' },
  performers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  selectedPerformer: { type: mongoose.Types.ObjectId, ref: 'User' },
  settled: { type: Date },
  witdrawn: { type: Date },
  rating: { type: Number }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);