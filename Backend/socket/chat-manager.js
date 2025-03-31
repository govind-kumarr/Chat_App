class ChatManager {
  static activeUsers = [];

  constructor() {}

  static addUser(socketId, userId) {
    const isActive = ChatManager.checkActive(userId.toString());
    if (!isActive) {
      ChatManager.activeUsers.push({
        socketId,
        userId: userId.toString(),
      });
    }
    console.log({ activeUsers: ChatManager.activeUsers });
  }

  static checkActive(userId) {
    console.log({ activeUsers: ChatManager.activeUsers });
    return (
      userId &&
      ChatManager.activeUsers.some((u) => {
        return u.userId === userId;
      })
    );
  }

  static removeActive(userId) {
    console.log({ activeUsers: ChatManager.activeUsers });
    ChatManager.activeUsers = ChatManager.activeUsers.filter(
      (u) => u.userId !== userId
    );
  }

  static getActiveUsers() {
    console.log({ activeUsers: ChatManager.activeUsers });
    return ChatManager.activeUsers;
  }
}

module.exports = {
  ChatManager,
};
