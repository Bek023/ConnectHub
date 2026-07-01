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
import '../auth_repository.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
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
      final result = await ref.read(authProvider.notifier).login(
            email: _emailCtrl.text.trim(),
            password: _passwordCtrl.text,
          );
      if (!mounted) return;
      if (result is LoginRequires2FA) {
        context.push(AppRoutes.otp, extra: {
          'twoFaToken': result.twoFaToken,
          'mode': '2fa',
        });
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kirish'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.space6),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
                const SizedBox(height: AppSpacing.space2),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () => context.push(AppRoutes.forgotPassword),
                    child: Text(
                      'Parolni unutdim?',
                      style: AppTextStyles.labelLg.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: AppSpacing.space3),
                  Text(
                    _error!,
                    style: AppTextStyles.bodySmError,
                  ),
                ],
                const SizedBox(height: AppSpacing.space6),
                AppButton(
                  label: 'Kirish',
                  onPressed: _submit,
                  loading: _loading,
                ),
                const SizedBox(height: AppSpacing.space5),
                _buildRegisterLink(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRegisterLink(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Akkaunt yo\'qmi? ',
          style: AppTextStyles.bodyMd.copyWith(color: AppColors.neutral400),
        ),
        GestureDetector(
          onTap: () => context.pushReplacement(AppRoutes.register),
          child: Text(
            'Ro\'yxatdan o\'tish',
            style: AppTextStyles.labelLg.copyWith(color: AppColors.primary),
          ),
        ),
      ],
    );
  }

  String? _validateEmail(String? v) {
    if (v == null || v.trim().isEmpty) return 'Email kiritilmadi';
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+$');
    if (!emailRegex.hasMatch(v.trim())) return 'Email noto\'g\'ri';
    return null;
  }

  String? _validatePassword(String? v) {
    if (v == null || v.isEmpty) return 'Parol kiritilmadi';
    if (v.length < 8) return 'Parol kamida 8 ta belgi';
    return null;
  }
}
