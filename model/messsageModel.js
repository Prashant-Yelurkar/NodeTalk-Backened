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
    fileName: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          // Only required if url exists
          if (this.url) return !!v;
          return true;
        },
        message: 'fileName is required when file URL is present',
      },
    },
    mimeType: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (this.url) return !!v;
          return true;
        },
        message: 'mimeType is required when file URL is present',
      },
    },
    // fileSize: {
    //   type: Number,
    //   default: null,
    //   validate: {
    //     validator: function (v) {
    //       if (this.url) return v != null;
    //       return true;
    //     },
    //     message: 'fileSize is required when file URL is present',
    //   },
    // },
    type: {
      type: String,
      default: 'text',
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model('Message', messageSchema);
export default MessageModel;
