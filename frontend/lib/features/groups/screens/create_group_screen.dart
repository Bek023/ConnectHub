import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../groups_notifier.dart';
import '../groups_repository.dart';

class CreateGroupScreen extends ConsumerStatefulWidget {
  const CreateGroupScreen({super.key});

  @override
  ConsumerState<CreateGroupScreen> createState() => _CreateGroupScreenState();
}

class _CreateGroupScreenState extends ConsumerState<CreateGroupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  String _type = 'public';
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
      final group = await ref.read(groupsRepositoryProvider).createGroup(
            title: _titleCtrl.text.trim(),
            description: _descCtrl.text.trim().isEmpty
                ? null
                : _descCtrl.text.trim(),
            type: _type,
          );
      ref.read(myGroupsProvider.notifier).addGroup(group);
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
        title: const Text('Yangi guruh'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: AppSpacing.space3),
            child: AppButton(
              label: 'Yaratish',
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
                label: 'Guruh nomi',
                hint: 'Masalan: Flutter Developers UZ',
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Nom kerak' : null,
              ),
              const SizedBox(height: AppSpacing.space4),
              AppTextField(
                controller: _descCtrl,
                label: 'Tavsif (ixtiyoriy)',
                hint: 'Guruh haqida qisqacha...',
                maxLines: 3,
              ),
              const SizedBox(height: AppSpacing.space5),
              Text('Kirish turi', style: AppTextStyles.labelLg),
              const SizedBox(height: AppSpacing.space3),
              Row(
                children: [
                  Expanded(
                    child: _TypeOption(
                      icon: Icons.public,
                      label: 'Ochiq',
                      sublabel: 'Har kim ko\'ra oladi',
                      selected: _type == 'public',
                      onTap: () => setState(() => _type = 'public'),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.space3),
                  Expanded(
                    child: _TypeOption(
                      icon: Icons.lock_outline,
                      label: 'Yopiq',
                      sublabel: 'Faqat taklif bilan',
                      selected: _type == 'private',
                      onTap: () => setState(() => _type = 'private'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.space6),
            ],
          ),
        ),
      ),
    );
  }
}

class _TypeOption extends StatelessWidget {
  const _TypeOption({
    required this.icon,
    required this.label,
    required this.sublabel,
    required this.selected,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final String sublabel;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final primary = Theme.of(context).colorScheme.primary;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(AppSpacing.space4),
        decoration: BoxDecoration(
          border: Border.all(
            color: selected ? primary : Theme.of(context).dividerColor,
            width: selected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(AppRadius.md),
          color: selected
              ? primary.withValues(alpha: 0.06)
              : Colors.transparent,
        ),
        child: Column(
          children: [
            Icon(icon, color: selected ? primary : null, size: 28),
            const SizedBox(height: 6),
            Text(
              label,
              style: AppTextStyles.labelLg.copyWith(
                color: selected ? primary : null,
              ),
            ),
            Text(sublabel, style: AppTextStyles.bodySm),
          ],
        ),
      ),
    );
  }
}
