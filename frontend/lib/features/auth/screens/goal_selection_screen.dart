import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/providers/theme_provider.dart';
import '../../../shared/widgets/app_button.dart';

const _goalCategories = [
  'Sport va sog\'liqni saqlash',
  'Ta\'lim va o\'z-o\'zini rivojlantirish',
  'Moliyaviy maqsadlar',
  'San\'at va ijodkorlik',
  'Texnologiya va dasturlash',
  'Tillar o\'rganish',
  'Biznes va tadbirkorlik',
  'Sayohat',
  'Ovqatlanish va parhezlar',
  'Kitob o\'qish',
  'Meditatsiya va mindfulness',
  'Jamoa va volontyorlik',
];

class GoalSelectionScreen extends ConsumerStatefulWidget {
  const GoalSelectionScreen({super.key});

  @override
  ConsumerState<GoalSelectionScreen> createState() =>
      _GoalSelectionScreenState();
}

class _GoalSelectionScreenState extends ConsumerState<GoalSelectionScreen> {
  final _selected = <String>{};

  void _toggle(String goal) {
    setState(() {
      if (_selected.contains(goal)) {
        _selected.remove(goal);
      } else {
        _selected.add(goal);
      }
    });
  }

  Future<void> _done() async {
    await ref.read(appPreferencesProvider).setOnboardingDone(true);
    if (!mounted) return;
    context.go(AppRoutes.feed);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Maqsadlaringizni tanlang'),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.space6,
                AppSpacing.space2,
                AppSpacing.space6,
                AppSpacing.space4,
              ),
              child: Text(
                'Siz uchun qiziqarli bo\'lgan sohalarni tanlang',
                style: AppTextStyles.bodyLg.copyWith(
                  color: AppColors.neutral400,
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.space6,
                ),
                child: Wrap(
                  spacing: AppSpacing.space3,
                  runSpacing: AppSpacing.space3,
                  children: _goalCategories
                      .map((g) => _GoalChip(
                            label: g,
                            selected: _selected.contains(g),
                            onTap: () => _toggle(g),
                          ))
                      .toList(),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.space6),
              child: Column(
                children: [
                  if (_selected.isNotEmpty)
                    Text(
                      '${_selected.length} ta tanlandi',
                      style: AppTextStyles.bodyMd.copyWith(
                        color: AppColors.neutral400,
                      ),
                    ),
                  const SizedBox(height: AppSpacing.space3),
                  AppButton(
                    label: _selected.isEmpty ? 'O\'tkazib yuborish' : 'Boshlash',
                    onPressed: _done,
                    variant: _selected.isEmpty
                        ? AppButtonVariant.outlined
                        : AppButtonVariant.primary,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GoalChip extends StatelessWidget {
  const _GoalChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space4,
          vertical: AppSpacing.space2,
        ),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : Colors.transparent,
          border: Border.all(
            color: selected ? AppColors.primary : Theme.of(context).dividerColor,
          ),
          borderRadius: BorderRadius.circular(AppRadius.full),
        ),
        child: Text(
          label,
          style: AppTextStyles.labelLg.copyWith(
            color: selected
                ? AppColors.white
                : Theme.of(context).colorScheme.onSurface,
          ),
        ),
      ),
    );
  }
}
