import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: false
  },
  groupName: {
    type: String,
    trim: true,
    required: function () {
      return this.isGroup;
    }
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.isGroup;
    }
  },
  lastMessage: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

chatSchema.index(
  { members: 1, isGroup: 1 },
  {
    unique: true,
    partialFilterExpression: { isGroup: false } 
  }
);

export default mongoose.model('Chat', chatSchema);
