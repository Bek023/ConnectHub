import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/providers/locale_provider.dart';

class LanguageScreen extends ConsumerWidget {
  const LanguageScreen({super.key});

  static const _languages = [
    (code: 'uz', label: "O'zbek", native: "O'zbek tili"),
    (code: 'ru', label: 'Русский', native: 'Русский язык'),
    (code: 'en', label: 'English', native: 'English'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final current = ref.watch(localeProvider).languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text('Til', style: AppTextStyles.heading3),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.space4),
        children: _languages.map((lang) {
          final selected = current == lang.code;
          return Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.space2),
            child: GestureDetector(
              onTap: () => ref
                  .read(localeProvider.notifier)
                  .setLocale(lang.code),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.space4,
                  vertical: AppSpacing.space4,
                ),
                decoration: BoxDecoration(
                  color: selected
                      ? AppColors.primary.withValues(alpha: 0.1)
                      : Theme.of(context).colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  border: Border.all(
                    color: selected ? AppColors.primary : Colors.transparent,
                    width: 1.5,
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            lang.label,
                            style: AppTextStyles.labelLg.copyWith(
                              color: selected
                                  ? AppColors.primary
                                  : Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          Text(
                            lang.native,
                            style: AppTextStyles.bodySm.copyWith(
                              color: AppColors.neutral400,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (selected)
                      const Icon(
                        Icons.check_circle,
                        color: AppColors.primary,
                        size: 20,
                      ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
