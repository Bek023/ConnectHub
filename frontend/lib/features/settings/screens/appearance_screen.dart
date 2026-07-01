import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/providers/theme_provider.dart';

class AppearanceScreen extends ConsumerWidget {
  const AppearanceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final current = ref.watch(themeModeProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Ko\'rinish', style: AppTextStyles.heading3),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.space4),
        children: [
          Text(
            'Tema',
            style: AppTextStyles.labelLg.copyWith(color: AppColors.neutral400),
          ),
          const SizedBox(height: AppSpacing.space3),
          _ThemeTile(
            label: 'Qorong\'u',
            subtitle: 'Qora fon',
            icon: Icons.dark_mode_outlined,
            mode: ThemeMode.dark,
            selected: current == ThemeMode.dark,
            onTap: () => ref
                .read(themeModeProvider.notifier)
                .setMode(ThemeMode.dark),
          ),
          const SizedBox(height: AppSpacing.space2),
          _ThemeTile(
            label: 'Yorug\'',
            subtitle: 'Oq fon',
            icon: Icons.light_mode_outlined,
            mode: ThemeMode.light,
            selected: current == ThemeMode.light,
            onTap: () => ref
                .read(themeModeProvider.notifier)
                .setMode(ThemeMode.light),
          ),
          const SizedBox(height: AppSpacing.space2),
          _ThemeTile(
            label: 'Tizim',
            subtitle: 'Qurilma sozlamalariga mos',
            icon: Icons.settings_suggest_outlined,
            mode: ThemeMode.system,
            selected: current == ThemeMode.system,
            onTap: () => ref
                .read(themeModeProvider.notifier)
                .setMode(ThemeMode.system),
          ),
        ],
      ),
    );
  }
}

class _ThemeTile extends StatelessWidget {
  const _ThemeTile({
    required this.label,
    required this.subtitle,
    required this.icon,
    required this.mode,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final String subtitle;
  final IconData icon;
  final ThemeMode mode;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(AppSpacing.space4),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary.withValues(alpha: 0.1)
              : scheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(
            color: selected ? AppColors.primary : Colors.transparent,
            width: 1.5,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: selected ? AppColors.primary : AppColors.neutral400,
              size: 24,
            ),
            const SizedBox(width: AppSpacing.space3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: AppTextStyles.labelLg.copyWith(
                      color: selected ? AppColors.primary : scheme.onSurface,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: AppTextStyles.bodySm.copyWith(
                      color: AppColors.neutral400,
                    ),
                  ),
                ],
              ),
            ),
            if (selected)
              const Icon(Icons.check_circle, color: AppColors.primary, size: 20),
          ],
        ),
      ),
    );
  }
}
