// models/Message.js

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
      default: '', 
    },
    url: {
      type: String, 
      default: null,
    },

    type: {
      type: String,
      enum: ['text', 'image', 'text+image'],
      default: 'text',
    }
  },
  {
    timestamps: true,
  }
);

const MessageModal = mongoose.model('Message', messageSchema);

export default MessageModal;
