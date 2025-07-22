import chatModel from "../model/chatModel.js";
import MessageModal from "../model/messsageModel.js";
import User from "../model/userModel.js";


const getMyChats = async(req, res)=>{
      try {
    const myUserId = req.user.id; 

    const chats = await chatModel.find({ members: myUserId }).select('members');

    const connections = [];

    for (const chat of chats) {
      const otherUserId = chat.members.find(id => id.toString() !== myUserId.toString());
      if (!otherUserId) continue;

      const user = await User.findById(otherUserId).select('name email profile');
      if (user) {
        connections.push({
          chatId: chat._id,
          user,
        });
      }
    }

    res.status(200).json({ success: true, data: connections });

  } catch (err) {
    console.error('Error getting connected users:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }

}

const getChatMessage = async (req, res) => {
  try {
    const chat_id = req.params.chat_id;

    const messages = await MessageModal.find({ chatId: chat_id }).sort({ createdAt: 1 }); // sorted by time (optional)

    if (!messages || messages.length === 0) {
      return res.status(200).json({ success: false, message: "No messages found." });
    }

    res.status(200).json({ success: true, data: messages });

  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export {getMyChats , getChatMessage}