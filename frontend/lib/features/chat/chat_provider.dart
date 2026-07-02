import 'dart:async';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'chat_repository.dart';
import 'chat_socket_service.dart';
import 'message_model.dart';

part 'chat_provider.g.dart';

class ChatState {
  const ChatState({
    this.messages = const [],
    this.isLoadingMore = false,
    this.hasMore = true,
    this.cursor,
    this.typingUserIds = const {},
  });

  final List<MessageModel> messages;
  final bool isLoadingMore;
  final bool hasMore;
  final String? cursor;
  final Set<String> typingUserIds;

  ChatState copyWith({
    List<MessageModel>? messages,
    bool? isLoadingMore,
    bool? hasMore,
    String? cursor,
    Set<String>? typingUserIds,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      hasMore: hasMore ?? this.hasMore,
      cursor: cursor ?? this.cursor,
      typingUserIds: typingUserIds ?? this.typingUserIds,
    );
  }
}

@riverpod
class Chat extends _$Chat {
  static const _limit = 30;
  final Map<String, Timer> _typingTimers = {};

  @override
  Future<ChatState> build(String chatType, String chatId) async {
    final socket = ref.read(chatSocketServiceProvider);
    await socket.connect();
    socket.joinChat(chatId);

    final sub1 = socket.newMessages
        .where((d) => d['chatId'] == chatId)
        .listen(_onNewMessage);
    final sub2 = socket.typing
        .where((d) => d['chatId'] == chatId)
        .listen(_onTyping);
    final sub3 = socket.reactions.listen(_onReaction);

    ref.onDispose(() {
      socket.leaveChat(chatId);
      sub1.cancel();
      sub2.cancel();
      sub3.cancel();
      for (final t in _typingTimers.values) {
        t.cancel();
      }
      _typingTimers.clear();
    });

    final page = await ref.read(chatRepositoryProvider).getMessages(
          chatType: chatType,
          chatId: chatId,
          limit: _limit,
        );

    return ChatState(
      messages: page.messages,
      hasMore: page.nextCursor != null,
      cursor: page.nextCursor,
    );
  }

  void _onNewMessage(Map<String, dynamic> data) {
    final msg = MessageModel.fromApi(data);
    final current = state.valueOrNull;
    if (current == null) return;
    final exists = current.messages.any((m) => m.id == msg.id);
    if (exists) return;

    _typingTimers.remove(msg.senderId)?.cancel();
    state = AsyncData(current.copyWith(
      messages: [msg, ...current.messages],
      typingUserIds: {...current.typingUserIds}..remove(msg.senderId),
    ));
  }

  void _onTyping(Map<String, dynamic> data) {
    final userId = data['userId'] as String?;
    if (userId == null) return;
    final current = state.valueOrNull;
    if (current == null) return;

    _typingTimers[userId]?.cancel();
    _typingTimers[userId] = Timer(const Duration(seconds: 3), () {
      final s = state.valueOrNull;
      if (s == null) return;
      state = AsyncData(s.copyWith(
        typingUserIds: {...s.typingUserIds}..remove(userId),
      ));
    });

    state = AsyncData(current.copyWith(
      typingUserIds: {...current.typingUserIds, userId},
    ));
  }

  void _onReaction(Map<String, dynamic> data) {
    final messageId = data['messageId'] as String?;
    final current = state.valueOrNull;
    if (messageId == null || current == null) return;
    final updated = current.messages.map((m) {
      if (m.id != messageId) return m;
      final reactions = (data['reactions'] as List<dynamic>?)
          ?.map((r) => ReactionModel.fromJson(r as Map<String, dynamic>))
          .toList();
      return reactions != null ? m.copyWith(reactions: reactions) : m;
    }).toList();
    state = AsyncData(current.copyWith(messages: updated));
  }

  Future<void> loadMore() async {
    final current = state.valueOrNull;
    if (current == null || !current.hasMore || current.isLoadingMore) return;
    state = AsyncData(current.copyWith(isLoadingMore: true));
    try {
      final page = await ref.read(chatRepositoryProvider).getMessages(
            chatType: chatType,
            chatId: chatId,
            cursor: current.cursor,
            limit: _limit,
          );
      final latest = state.valueOrNull ?? current;
      final existingIds = latest.messages.map((m) => m.id).toSet();
      final more =
          page.messages.where((m) => !existingIds.contains(m.id)).toList();
      state = AsyncData(latest.copyWith(
        messages: [...latest.messages, ...more],
        hasMore: page.nextCursor != null,
        isLoadingMore: false,
        cursor: page.nextCursor ?? latest.cursor,
      ));
    } catch (_) {
      final latest = state.valueOrNull ?? current;
      state = AsyncData(latest.copyWith(isLoadingMore: false));
    }
  }

  void send({required String content, String type = 'text', String? mediaUrl}) {
    ref.read(chatSocketServiceProvider).sendMessage(
          chatType: chatType,
          chatId: chatId,
          content: content,
          type: type,
          mediaUrl: mediaUrl,
        );
  }

  void emitTyping() {
    ref.read(chatSocketServiceProvider).sendTyping(chatId);
  }

  void react(String messageId, String emoji) {
    ref.read(chatSocketServiceProvider).reactToMessage(messageId, emoji);
  }

  void markRead(String messageId) {
    ref.read(chatSocketServiceProvider).markRead(messageId);
  }
}
