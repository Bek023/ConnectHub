import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../post_model.dart';

class PostHeader extends StatelessWidget {
  const PostHeader({
    super.key,
    required this.author,
    required this.createdAt,
  });

  final PostAuthorModel author;
  final String createdAt;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        AppAvatar(
          imageUrl: author.avatarUrl,
          name: author.displayName,
          size: AppAvatarSize.sm,
        ),
        const SizedBox(width: AppSpacing.space3),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    author.displayName,
                    style: AppTextStyles.labelLg.copyWith(
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  if (author.isVerified) ...[
                    const SizedBox(width: 4),
                    const Icon(
                      Icons.verified,
                      size: 14,
                      color: Color(0xFF14B8A6),
                    ),
                  ],
                ],
              ),
              Text(
                '@${author.username ?? author.id}',
                style: AppTextStyles.bodySm,
              ),
            ],
          ),
        ),
        Text(
          _timeAgo(createdAt),
          style: AppTextStyles.bodySm,
        ),
      ],
    );
  }

  String _timeAgo(String iso) {
    try {
      final date = DateTime.parse(iso).toLocal();
      final diff = DateTime.now().difference(date);
      if (diff.inSeconds < 60) return 'Hozir';
      if (diff.inMinutes < 60) return '${diff.inMinutes} daq';
      if (diff.inHours < 24) return '${diff.inHours} soat';
      if (diff.inDays < 7) return '${diff.inDays} kun';
      if (diff.inDays < 30) return '${(diff.inDays / 7).floor()} hafta';
      if (diff.inDays < 365) return '${(diff.inDays / 30).floor()} oy';
      return '${(diff.inDays / 365).floor()} yil';
    } catch (_) {
      return '';
    }
  }
}
