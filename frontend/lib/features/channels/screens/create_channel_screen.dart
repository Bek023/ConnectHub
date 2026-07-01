import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../channels_notifier.dart';
import '../channels_repository.dart';

const _kCategories = [
  'texnologiya',
  'biznes',
  'sport',
  'siyosat',
  'madaniyat',
  'ilm-fan',
  'ko\'ngilochar',
  'ta\'lim',
  'boshqa',
];

class CreateChannelScreen extends ConsumerStatefulWidget {
  const CreateChannelScreen({super.key});

  @override
  ConsumerState<CreateChannelScreen> createState() =>
      _CreateChannelScreenState();
}

class _CreateChannelScreenState extends ConsumerState<CreateChannelScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  String? _selectedCategory;
  bool _submitting = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    try {
      final channel = await ref.read(channelsRepositoryProvider).createChannel(
            name: _nameCtrl.text.trim(),
            description: _descCtrl.text.trim().isEmpty
                ? null
                : _descCtrl.text.trim(),
            category: _selectedCategory,
          );
      ref.read(myChannelsProvider.notifier).addChannel(channel);
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
        title: const Text('Yangi kanal'),
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
                controller: _nameCtrl,
                label: 'Kanal nomi',
                hint: 'Masalan: Flutter UZ News',
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Nom kerak' : null,
              ),
              const SizedBox(height: AppSpacing.space4),
              AppTextField(
                controller: _descCtrl,
                label: 'Tavsif (ixtiyoriy)',
                hint: 'Kanal haqida qisqacha...',
                maxLines: 3,
              ),
              const SizedBox(height: AppSpacing.space5),
              Text('Kategoriya (ixtiyoriy)', style: AppTextStyles.labelLg),
              const SizedBox(height: AppSpacing.space3),
              Wrap(
                spacing: AppSpacing.space2,
                runSpacing: AppSpacing.space2,
                children: _kCategories.map((cat) {
                  final selected = cat == _selectedCategory;
                  return GestureDetector(
                    onTap: () => setState(() {
                      _selectedCategory = selected ? null : cat;
                    }),
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
                          color: selected ? Colors.white : null,
                          fontWeight: selected ? FontWeight.w600 : null,
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
