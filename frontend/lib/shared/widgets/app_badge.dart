import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

class AppBadge extends StatelessWidget {
  const AppBadge({
    super.key,
    required this.child,
    required this.count,
    this.color,
    this.maxCount = 99,
    this.visible = true,
  });

  final Widget child;
  final int count;
  final Color? color;
  final int maxCount;
  final bool visible;

  String get _label => count > maxCount ? '$maxCount+' : '$count';

  @override
  Widget build(BuildContext context) {
    if (!visible || count <= 0) return child;

    return Stack(
      clipBehavior: Clip.none,
      children: [
        child,
        Positioned(
          top: -4,
          right: -4,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
            decoration: BoxDecoration(
              color: color ?? AppColors.accentOrange,
              borderRadius: BorderRadius.circular(999),
              border: Border.all(
                color: Theme.of(context).scaffoldBackgroundColor,
                width: 1.5,
              ),
            ),
            child: Text(
              _label,
              style: AppTextStyles.bodySm.copyWith(
                color: AppColors.white,
                fontWeight: FontWeight.w600,
                fontSize: 10,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
