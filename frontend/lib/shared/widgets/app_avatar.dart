import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

enum AppAvatarSize { xs, sm, md, lg, xl }

class AppAvatar extends StatelessWidget {
  const AppAvatar({
    super.key,
    this.imageUrl,
    this.name,
    this.size = AppAvatarSize.md,
    this.isOnline = false,
    this.onTap,
    this.borderColor,
    this.borderWidth = 0,
  });

  final String? imageUrl;
  final String? name;
  final AppAvatarSize size;
  final bool isOnline;
  final VoidCallback? onTap;
  final Color? borderColor;
  final double borderWidth;

  double get _diameter => switch (size) {
        AppAvatarSize.xs => 24,
        AppAvatarSize.sm => 32,
        AppAvatarSize.md => 40,
        AppAvatarSize.lg => 56,
        AppAvatarSize.xl => 80,
      };

  double get _indicatorSize => switch (size) {
        AppAvatarSize.xs => 6,
        AppAvatarSize.sm => 8,
        AppAvatarSize.md => 10,
        AppAvatarSize.lg => 12,
        AppAvatarSize.xl => 16,
      };

  String _initials() {
    if (name == null || name!.trim().isEmpty) return '?';
    final parts = name!.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  TextStyle get _textStyle => switch (size) {
        AppAvatarSize.xs => AppTextStyles.bodySm,
        AppAvatarSize.sm => AppTextStyles.bodySm,
        AppAvatarSize.md => AppTextStyles.labelLg,
        AppAvatarSize.lg => AppTextStyles.heading3,
        AppAvatarSize.xl => AppTextStyles.heading2,
      };

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Stack(
        children: [
          Container(
            width: _diameter,
            height: _diameter,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: borderWidth > 0
                  ? Border.all(
                      color: borderColor ?? AppColors.primary,
                      width: borderWidth,
                    )
                  : null,
            ),
            child: ClipOval(child: _buildImage()),
          ),
          if (isOnline)
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                width: _indicatorSize,
                height: _indicatorSize,
                decoration: BoxDecoration(
                  color: AppColors.accentGreen,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: Theme.of(context).scaffoldBackgroundColor,
                    width: 1.5,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildImage() {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return CachedNetworkImage(
        imageUrl: imageUrl!,
        fit: BoxFit.cover,
        placeholder: (_, __) => _buildFallback(),
        errorWidget: (_, __, ___) => _buildFallback(),
      );
    }
    return _buildFallback();
  }

  Widget _buildFallback() {
    return Container(
      color: AppColors.primary.withValues(alpha: 0.15),
      alignment: Alignment.center,
      child: Text(
        _initials(),
        style: _textStyle.copyWith(color: AppColors.primary),
      ),
    );
  }
}
