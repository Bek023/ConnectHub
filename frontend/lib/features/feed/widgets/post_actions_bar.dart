import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';

class PostActionsBar extends StatelessWidget {
  const PostActionsBar({
    super.key,
    required this.likesCount,
    required this.commentsCount,
    required this.isLiked,
    required this.onLike,
    required this.onComment,
    required this.onShare,
  });

  final int likesCount;
  final int commentsCount;
  final bool isLiked;
  final VoidCallback onLike;
  final VoidCallback onComment;
  final VoidCallback onShare;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _ActionButton(
          icon: isLiked ? Icons.favorite : Icons.favorite_border,
          label: _formatCount(likesCount),
          color: isLiked ? AppColors.accentPink : null,
          onTap: onLike,
        ),
        const SizedBox(width: AppSpacing.space5),
        _ActionButton(
          icon: Icons.chat_bubble_outline,
          label: _formatCount(commentsCount),
          onTap: onComment,
        ),
        const Spacer(),
        _ActionButton(
          icon: Icons.share_outlined,
          onTap: onShare,
        ),
      ],
    );
  }

  String _formatCount(int count) {
    if (count == 0) return '';
    if (count >= 1000000) return '${(count / 1000000).toStringAsFixed(1)}M';
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}K';
    return '$count';
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    this.label,
    this.color,
    required this.onTap,
  });

  final IconData icon;
  final String? label;
  final Color? color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final iconColor = color ?? Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6);

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.space2),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 20, color: iconColor),
            if (label != null && label!.isNotEmpty) ...[
              const SizedBox(width: 4),
              Text(
                label!,
                style: AppTextStyles.bodySm.copyWith(color: iconColor),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
