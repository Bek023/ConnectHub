/// Socket.io event nomlari — barcha namespace'lar uchun.
/// Manba: API_DOCS.md > bo'lim 5 (Messages WS), 10 (Calls WS), 12 (Notifications WS).
abstract class SocketEvents {
  // ---- /chat namespace: client -> server ----
  static const joinChat = 'joinChat';
  static const leaveChat = 'leaveChat';
  static const sendMessage = 'sendMessage';
  static const typing = 'typing';
  static const reactToMessage = 'reactToMessage';
  static const markRead = 'markRead';

  // ---- /chat namespace: server -> client ----
  static const newMessage = 'newMessage';
  static const userTyping = 'userTyping';
  static const messageReaction = 'messageReaction';

  // ---- /calls namespace: client -> server ----
  static const joinCallRoom = 'joinCallRoom';
  static const leaveCallRoom = 'leaveCallRoom';
  static const createTransport = 'createTransport';
  static const connectTransport = 'connectTransport';
  static const produce = 'produce';
  static const getProducers = 'getProducers';
  static const consume = 'consume';
  static const resumeConsumer = 'resumeConsumer';
  static const endCall = 'endCall';

  // ---- /calls namespace: server -> client ----
  static const userJoinedCall = 'userJoinedCall';
  static const userLeftCall = 'userLeftCall';
  static const newProducer = 'newProducer';
  static const callEnded = 'callEnded';

  // ---- /notifications namespace: server -> client ----
  static const notification = 'notification';
  // newMessage shu namespace'da ham keladi (fon preview uchun) — yuqoridagi
  // bilan bir xil nom, lekin alohida namespace orqali ulanadi.
}
