import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../goals_notifier.dart';
import '../goals_repository.dart';

const _kCategories = [
  'fitness',
  'learning',
  'career',
  'creativity',
  'health',
  'finance',
  'social',
  'mindfulness',
  'travel',
  'cooking',
  'reading',
  'other',
];

class CreateGoalScreen extends ConsumerStatefulWidget {
  const CreateGoalScreen({super.key});

  @override
  ConsumerState<CreateGoalScreen> createState() => _CreateGoalScreenState();
}

class _CreateGoalScreenState extends ConsumerState<CreateGoalScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  String _selectedCategory = _kCategories.first;
  bool _submitting = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    try {
      final goal = await ref.read(goalsRepositoryProvider).createGoal(
            title: _titleCtrl.text.trim(),
            description: _descCtrl.text.trim().isEmpty
                ? null
                : _descCtrl.text.trim(),
            category: _selectedCategory,
          );
      ref.read(myGoalsProvider.notifier).addGoal(goal);
      ref.read(trendingGoalsProvider.notifier).refresh();
      if (mounted) Navigator.of(context).pop();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Yangi maqsad'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: AppSpacing.space3),
            child: AppButton(
              label: 'Saqlash',
              variant: AppButtonVariant.primary,
              size: AppButtonSize.sm,
              loading: _submitting,
              onPressed: _submitting ? null : _submit,
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.space4),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AppTextField(
                controller: _titleCtrl,
                label: 'Sarlavha',
                hint: 'Maqsad nomi',
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Sarlavha kerak' : null,
              ),
              const SizedBox(height: AppSpacing.space4),
              AppTextField(
                controller: _descCtrl,
                label: 'Tavsif (ixtiyoriy)',
                hint: 'Bu maqsad haqida...',
                maxLines: 4,
              ),
              const SizedBox(height: AppSpacing.space5),
              Text('Kategoriya', style: AppTextStyles.labelLg),
              const SizedBox(height: AppSpacing.space3),
              Wrap(
                spacing: AppSpacing.space2,
                runSpacing: AppSpacing.space2,
                children: _kCategories.map((cat) {
                  final selected = cat == _selectedCategory;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategory = cat),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.space4,
                        vertical: AppSpacing.space2,
                      ),
                      decoration: BoxDecoration(
                        color: selected
                            ? Theme.of(context).colorScheme.primary
                            : Theme.of(context).dividerColor,
                        borderRadius: BorderRadius.circular(AppRadius.full),
                      ),
                      child: Text(
                        cat,
                        style: AppTextStyles.bodyMd.copyWith(
                          color: selected
                              ? Colors.white
                              : Theme.of(context).colorScheme.onSurface,
                          fontWeight: selected
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: AppSpacing.space6),
            ],
          ),
        ),
      ),
    );
  }
}
