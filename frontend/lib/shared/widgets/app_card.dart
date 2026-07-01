import 'package:flutter/material.dart';
import '../../core/theme/app_spacing.dart';

class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding,
    this.margin,
    this.borderRadius,
    this.color,
  });

  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? borderRadius;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final radius = borderRadius ?? AppRadius.md;

    return Container(
      margin: margin,
      decoration: BoxDecoration(
        color: color ?? theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(
          color: theme.dividerColor,
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(radius),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(radius),
          child: Padding(
            padding: padding ??
                const EdgeInsets.all(AppSpacing.space4),
            child: child,
          ),
        ),
      ),
    );
  }
}
