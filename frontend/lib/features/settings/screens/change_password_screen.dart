import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../settings_repository.dart';

class ChangePasswordScreen extends ConsumerStatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  ConsumerState<ChangePasswordScreen> createState() =>
      _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends ConsumerState<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _currentCtrl = TextEditingController();
  final _newCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _currentCtrl.dispose();
    _newCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      await ref.read(settingsRepositoryProvider).changePassword(
            currentPassword: _currentCtrl.text,
            newPassword: _newCtrl.text,
          );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Parol muvaffaqiyatli o\'zgartirildi')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Parolni o\'zgartirish', style: AppTextStyles.heading3),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.space4),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              AppTextField(
                controller: _currentCtrl,
                label: 'Joriy parol',
                isPassword: true,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Joriy parolni kiriting' : null,
              ),
              const SizedBox(height: AppSpacing.space4),
              AppTextField(
                controller: _newCtrl,
                label: 'Yangi parol',
                isPassword: true,
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Yangi parolni kiriting';
                  if (v.length < 8) return 'Kamida 8 ta belgi bo\'lishi kerak';
                  return null;
                },
              ),
              const SizedBox(height: AppSpacing.space4),
              AppTextField(
                controller: _confirmCtrl,
                label: 'Parolni tasdiqlang',
                isPassword: true,
                validator: (v) =>
                    v != _newCtrl.text ? 'Parollar mos emas' : null,
              ),
              const SizedBox(height: AppSpacing.space6),
              AppButton(
                label: 'Saqlash',
                onPressed: _loading ? null : _submit,
                loading: _loading,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
