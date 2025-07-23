import User from "../model/userModel.js";
import chatModel from "../model/chatModel.js";

const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search } = req.body;
    const skip = (page - 1) * limit;
    const currentUserId = req.user.id;

    const searchQuery = {
      $or: [
        { name: { $regex: '^' + search, $options: 'i' } },
        { email: { $regex: '^' + search, $options: 'i' } },
      ],
    };

    const baseQuery = {
      _id: { $ne: currentUserId }, // exclude self
      ...(search !== '' && searchQuery),
    };

    const users = await User.find(baseQuery)
      .select('name email profile isOnline  lastActive ')
      .skip(skip)
      .limit(limit);

    // Check for existing 1-1 chats for each user
    const usersWithChat = await Promise.all(
      users.map(async (user) => {
        const chat = await chatModel.findOne({
          isGroup: false,
          members: { $all: [currentUserId, user._id], $size: 2 },
        }).select('_id');

        return {
            chatId: chat ? chat._id : null,
            user :{
                _id: user._id,
              name: user.name,
              email: user.email,
              profile: user.profile,
              isOnline:user.isOnline ,
              lastActive: user.lastActive
            }
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: usersWithChat,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
    });
  }
};





const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        let user = await User.findById(userId).select('name email profile');

        if (user) {
            const userData = {
                id: user._id, 
                name: user.name,
                email: user.email,
                profile: user.profile
            };

            res.status(200).json({ success: true, data: userData });
        } else {
            res.status(404).json({ success: false, message: "User Not Found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


export { getAllUsers , getUserById };
