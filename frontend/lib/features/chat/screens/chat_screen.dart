import 'dart:async';

import 'package:emoji_picker_flutter/emoji_picker_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_error_state.dart';
import '../../../shared/widgets/app_shimmer.dart';
import '../../auth/auth_notifier.dart';
import '../chat_provider.dart';
import '../message_model.dart';
import '../widgets/message_bubble.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({
    super.key,
    required this.chatType,
    required this.chatId,
    required this.chatName,
  });

  final String chatType;
  final String chatId;
  final String chatName;

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  Timer? _typingTimer;
  bool _showEmojiPicker = false;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    _typingTimer?.cancel();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 100) {
      ref
          .read(chatProvider(widget.chatType, widget.chatId).notifier)
          .loadMore();
    }
  }

  void _handleSend() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    ref
        .read(chatProvider(widget.chatType, widget.chatId).notifier)
        .send(content: text);
    _controller.clear();
    setState(() => _showEmojiPicker = false);
  }

  void _handleTyping() {
    _typingTimer?.cancel();
    _typingTimer = Timer(const Duration(milliseconds: 500), () {
      ref
          .read(chatProvider(widget.chatType, widget.chatId).notifier)
          .emitTyping();
    });
  }

  void _toggleEmojiPicker() {
    setState(() => _showEmojiPicker = !_showEmojiPicker);
    if (_showEmojiPicker) {
      FocusScope.of(context).unfocus();
    }
  }

  void _showReactionPicker(MessageModel message) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.lg)),
      ),
      builder: (_) => _ReactionPicker(
        onReact: (emoji) {
          ref
              .read(chatProvider(widget.chatType, widget.chatId).notifier)
              .react(message.id, emoji);
          Navigator.pop(context);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatProvider(widget.chatType, widget.chatId));
    final currentUserId =
        ref.watch(authProvider).valueOrNull?.id ?? '';
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.chatName, style: AppTextStyles.heading3),
        backgroundColor: scheme.surface,
        elevation: 0,
      ),
      body: Column(
        children: [
          Expanded(
            child: chatState.when(
              data: (state) => _MessagesList(
                state: state,
                currentUserId: currentUserId,
                scrollController: _scrollController,
                onLongPress: _showReactionPicker,
              ),
              loading: () => const _MessagesShimmer(),
              error: (e, _) => AppErrorState(
                message: e.toString().replaceFirst('Exception: ', ''),
                onRetry: () => ref.invalidate(
                  chatProvider(widget.chatType, widget.chatId),
                ),
              ),
            ),
          ),
          _TypingIndicator(
            typingUserIds: chatState.valueOrNull?.typingUserIds ?? {},
          ),
          _InputBar(
            controller: _controller,
            onSend: _handleSend,
            onTyping: _handleTyping,
            onEmojiToggle: _toggleEmojiPicker,
          ),
          if (_showEmojiPicker)
            SizedBox(
              height: 260,
              child: EmojiPicker(
                onEmojiSelected: (_, emoji) {
                  _controller.text += emoji.emoji;
                },
              ),
            ),
        ],
      ),
    );
  }
}

class _MessagesList extends StatelessWidget {
  const _MessagesList({
    required this.state,
    required this.currentUserId,
    required this.scrollController,
    required this.onLongPress,
  });

  final ChatState state;
  final String currentUserId;
  final ScrollController scrollController;
  final void Function(MessageModel) onLongPress;

  @override
  Widget build(BuildContext context) {
    final messages = state.messages;
    if (messages.isEmpty) {
      return const Center(child: Text('Hali xabarlar yo\'q'));
    }

    return ListView.builder(
      controller: scrollController,
      reverse: true,
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.space2),
      itemCount: messages.length + (state.isLoadingMore ? 1 : 0),
      itemBuilder: (_, index) {
        if (index == messages.length) {
          return const Padding(
            padding: EdgeInsets.all(AppSpacing.space4),
            child: Center(child: CircularProgressIndicator()),
          );
        }
        final msg = messages[index];
        final isOwn = msg.senderId == currentUserId;
        final showSenderInfo = !isOwn &&
            (index == messages.length - 1 ||
                messages[index + 1].senderId != msg.senderId);
        return MessageBubble(
          message: msg,
          isOwn: isOwn,
          showSenderInfo: showSenderInfo,
          onLongPress: () => onLongPress(msg),
        );
      },
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  const _TypingIndicator({required this.typingUserIds});

  final Set<String> typingUserIds;

  @override
  Widget build(BuildContext context) {
    if (typingUserIds.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.space4,
        AppSpacing.space1,
        AppSpacing.space4,
        0,
      ),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          typingUserIds.length == 1
              ? 'Kimdir yozmoqda...'
              : '${typingUserIds.length} kishi yozmoqda...',
          style: AppTextStyles.bodySm.copyWith(
            color: AppColors.neutral400,
            fontStyle: FontStyle.italic,
          ),
        ),
      ),
    );
  }
}

class _InputBar extends StatelessWidget {
  const _InputBar({
    required this.controller,
    required this.onSend,
    required this.onTyping,
    required this.onEmojiToggle,
  });

  final TextEditingController controller;
  final VoidCallback onSend;
  final VoidCallback onTyping;
  final VoidCallback onEmojiToggle;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space3,
          vertical: AppSpacing.space2,
        ),
        decoration: BoxDecoration(
          color: scheme.surface,
          border: Border(top: BorderSide(color: scheme.outlineVariant)),
        ),
        child: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.sentiment_satisfied_outlined),
              color: AppColors.neutral400,
              onPressed: onEmojiToggle,
            ),
            Expanded(
              child: TextField(
                controller: controller,
                maxLines: 5,
                minLines: 1,
                onChanged: (_) => onTyping(),
                decoration: InputDecoration(
                  hintText: 'Xabar yozing...',
                  hintStyle: AppTextStyles.bodyMd.copyWith(
                    color: AppColors.neutral400,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppRadius.full),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: scheme.surfaceContainerHighest,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.space4,
                    vertical: AppSpacing.space2,
                  ),
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.space2),
            IconButton(
              icon: const Icon(Icons.send_rounded),
              color: AppColors.primary,
              onPressed: onSend,
            ),
          ],
        ),
      ),
    );
  }
}

class _ReactionPicker extends StatelessWidget {
  const _ReactionPicker({required this.onReact});

  final void Function(String emoji) onReact;

  static const _emojis = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.space6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: _emojis
            .map(
              (e) => GestureDetector(
                onTap: () => onReact(e),
                child: Text(e, style: const TextStyle(fontSize: 32)),
              ),
            )
            .toList(),
      ),
    );
  }
}

class _MessagesShimmer extends StatelessWidget {
  const _MessagesShimmer();

  @override
  Widget build(BuildContext context) {
    return AppShimmer(
      child: ListView.builder(
        reverse: true,
        padding: const EdgeInsets.all(AppSpacing.space4),
        itemCount: 8,
        itemBuilder: (_, i) => Padding(
          padding: const EdgeInsets.only(bottom: AppSpacing.space3),
          child: Align(
            alignment:
                i.isEven ? Alignment.centerRight : Alignment.centerLeft,
            child: ShimmerBox(
              width: 120 + (i % 3) * 40,
              height: 40,
            ),
          ),
        ),
      ),
    );
  }
}
