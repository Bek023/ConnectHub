import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../message_model.dart';

class MessageBubble extends StatelessWidget {
  const MessageBubble({
    super.key,
    required this.message,
    required this.isOwn,
    required this.showSenderInfo,
    this.onLongPress,
    this.onReact,
  });

  final MessageModel message;
  final bool isOwn;
  final bool showSenderInfo;
  final VoidCallback? onLongPress;
  final void Function(String emoji)? onReact;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Padding(
      padding: EdgeInsets.only(
        left: isOwn ? AppSpacing.space10 : AppSpacing.space2,
        right: isOwn ? AppSpacing.space2 : AppSpacing.space10,
        bottom: AppSpacing.space1,
      ),
      child: Row(
        mainAxisAlignment:
            isOwn ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isOwn && showSenderInfo) ...[
            AppAvatar(
              imageUrl: message.senderAvatarUrl,
              name: message.senderName,
              size: AppAvatarSize.sm,
            ),
            const SizedBox(width: AppSpacing.space2),
          ] else if (!isOwn) ...[
            const SizedBox(width: 32 + AppSpacing.space2),
          ],
          Flexible(
            child: GestureDetector(
              onLongPress: onLongPress,
              child: Column(
                crossAxisAlignment: isOwn
                    ? CrossAxisAlignment.end
                    : CrossAxisAlignment.start,
                children: [
                  if (!isOwn && showSenderInfo)
                    Padding(
                      padding: const EdgeInsets.only(
                        left: AppSpacing.space2,
                        bottom: 2,
                      ),
                      child: Text(
                        message.senderName,
                        style: AppTextStyles.bodySm.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  _BubbleContent(
                    message: message,
                    isOwn: isOwn,
                    scheme: scheme,
                  ),
                  if (message.reactions.isNotEmpty)
                    _ReactionsRow(reactions: message.reactions),
                  Padding(
                    padding: const EdgeInsets.only(
                      top: 2,
                      left: AppSpacing.space2,
                      right: AppSpacing.space2,
                    ),
                    child: Text(
                      _formatTime(message.createdAt),
                      style: AppTextStyles.bodySm.copyWith(
                        color: scheme.onSurface.withValues(alpha: 0.45),
                        fontSize: 10,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(String createdAt) {
    try {
      final dt = DateTime.parse(createdAt).toLocal();
      return DateFormat('HH:mm').format(dt);
    } catch (_) {
      return '';
    }
  }
}

class _BubbleContent extends StatelessWidget {
  const _BubbleContent({
    required this.message,
    required this.isOwn,
    required this.scheme,
  });

  final MessageModel message;
  final bool isOwn;
  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    final bg = isOwn ? AppColors.primary : scheme.surfaceContainerHighest;
    final fg = isOwn ? Colors.white : scheme.onSurface;

    if (message.type == 'image' && message.mediaUrl != null) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: CachedNetworkImage(
          imageUrl: message.mediaUrl!,
          width: 220,
          height: 180,
          fit: BoxFit.cover,
          placeholder: (_, __) => Container(
            width: 220,
            height: 180,
            color: scheme.surfaceContainerHighest,
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space3,
        vertical: AppSpacing.space2,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.only(
          topLeft: const Radius.circular(AppRadius.md),
          topRight: const Radius.circular(AppRadius.md),
          bottomLeft: Radius.circular(isOwn ? AppRadius.md : AppRadius.sm),
          bottomRight: Radius.circular(isOwn ? AppRadius.sm : AppRadius.md),
        ),
      ),
      child: Text(
        message.content,
        style: AppTextStyles.bodyMd.copyWith(color: fg),
      ),
    );
  }
}

class _ReactionsRow extends StatelessWidget {
  const _ReactionsRow({required this.reactions});

  final List<ReactionModel> reactions;

  @override
  Widget build(BuildContext context) {
    final grouped = <String, int>{};
    for (final r in reactions) {
      grouped[r.emoji] = (grouped[r.emoji] ?? 0) + 1;
    }
    return Padding(
      padding: const EdgeInsets.only(top: 2),
      child: Wrap(
        spacing: 4,
        children: grouped.entries.map((e) {
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(AppRadius.full),
            ),
            child: Text(
              '${e.key} ${e.value}',
              style: const TextStyle(fontSize: 12),
            ),
          );
        }).toList(),
      ),
    );
  }
}
