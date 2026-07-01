import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../auth_notifier.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _usernameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _usernameCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final userId = await ref.read(authProvider.notifier).register(
            username: _usernameCtrl.text.trim(),
            email: _emailCtrl.text.trim(),
            password: _passwordCtrl.text,
            displayName: _nameCtrl.text.trim(),
          );
      if (!mounted) return;
      context.push(AppRoutes.otp, extra: {
        'userId': userId,
        'email': _emailCtrl.text.trim(),
        'mode': 'verify',
      });
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ro\'yxatdan o\'tish')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.space6),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                const SizedBox(height: AppSpacing.space4),
                AppTextField(
                  controller: _nameCtrl,
                  label: 'To\'liq ism',
                  hint: 'Ali Valiyev',
                  textInputAction: TextInputAction.next,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Ism kiritilmadi' : null,
                ),
                const SizedBox(height: AppSpacing.space4),
                AppTextField(
                  controller: _usernameCtrl,
                  label: 'Foydalanuvchi nomi',
                  hint: 'ali_valiyev',
                  textInputAction: TextInputAction.next,
                  validator: _validateUsername,
                ),
                const SizedBox(height: AppSpacing.space4),
                AppTextField(
                  controller: _emailCtrl,
                  label: 'Email',
                  hint: 'example@email.com',
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  validator: _validateEmail,
                ),
                const SizedBox(height: AppSpacing.space4),
                AppTextField(
                  controller: _passwordCtrl,
                  label: 'Parol',
                  hint: '••••••••',
                  isPassword: true,
                  textInputAction: TextInputAction.done,
                  onSubmitted: (_) => _submit(),
                  validator: _validatePassword,
                ),
                if (_error != null) ...[
                  const SizedBox(height: AppSpacing.space3),
                  Text(_error!, style: AppTextStyles.bodySmError),
                ],
                const SizedBox(height: AppSpacing.space6),
                AppButton(
                  label: 'Davom etish',
                  onPressed: _submit,
                  loading: _loading,
                ),
                const SizedBox(height: AppSpacing.space5),
                _buildLoginLink(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoginLink(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Akkaunt bormi? ',
          style: AppTextStyles.bodyMd.copyWith(color: AppColors.neutral400),
        ),
        GestureDetector(
          onTap: () => context.pushReplacement(AppRoutes.login),
          child: Text(
            'Kirish',
            style: AppTextStyles.labelLg.copyWith(color: AppColors.primary),
          ),
        ),
      ],
    );
  }

  String? _validateUsername(String? v) {
    if (v == null || v.trim().isEmpty) return 'Foydalanuvchi nomi kiritilmadi';
    if (v.length < 3) return 'Kamida 3 ta belgi';
    if (!RegExp(r'^[a-z0-9_]+$').hasMatch(v)) {
      return 'Faqat kichik harf, raqam va _';
    }
    return null;
  }

  String? _validateEmail(String? v) {
    if (v == null || v.trim().isEmpty) return 'Email kiritilmadi';
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(v.trim())) {
      return 'Email noto\'g\'ri';
    }
    return null;
  }

  String? _validatePassword(String? v) {
    if (v == null || v.isEmpty) return 'Parol kiritilmadi';
    if (v.length < 8) return 'Kamida 8 ta belgi';
    if (!RegExp(r'[A-Z]').hasMatch(v)) return 'Katta harf bo\'lishi kerak';
    if (!RegExp(r'[0-9]').hasMatch(v)) return 'Raqam bo\'lishi kerak';
    return null;
  }
}
