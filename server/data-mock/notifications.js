// Mock notification data (mirrors the notifications table)

const notifications = [
  { id: 1, userId: 1, spaceId: 6, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), message: "Van Reken Quiet Floor just opened up.", type: "openSpot", isRead: false },
  { id: 2, userId: 1, spaceId: 16, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), message: "Your suggestion was approved.", type: "suggestionApproved", isRead: true },
  { id: 3, userId: 2, spaceId: 17, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), message: "Hoogenboom Courts are less busy now.", type: "openSpot", isRead: false }
];

module.exports = notifications;
