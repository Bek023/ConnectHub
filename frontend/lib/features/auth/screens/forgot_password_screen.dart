import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../auth_repository.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() =>
      _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _emailCtrl = TextEditingController();
  bool _loading = false;
  bool _sent = false;
  String? _error;

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _emailCtrl.text.trim();
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(email)) {
      setState(() => _error = 'Email noto\'g\'ri');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ref.read(authRepositoryProvider).forgotPassword(email);
      if (!mounted) return;
      setState(() => _sent = true);
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Parolni tiklash')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.space6),
          child: _sent ? _buildSuccess(context) : _buildForm(),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: AppSpacing.space4),
        Text(
          'Email manzilingizni kiriting, tiklash kodi yuboramiz',
          style: AppTextStyles.bodyLg.copyWith(color: AppColors.neutral400),
        ),
        const SizedBox(height: AppSpacing.space6),
        AppTextField(
          controller: _emailCtrl,
          label: 'Email',
          hint: 'example@email.com',
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.done,
          onSubmitted: (_) => _submit(),
        ),
        if (_error != null) ...[
          const SizedBox(height: AppSpacing.space3),
          Text(_error!, style: AppTextStyles.bodySmError),
        ],
        const SizedBox(height: AppSpacing.space6),
        AppButton(label: 'Yuborish', onPressed: _submit, loading: _loading),
      ],
    );
  }

  Widget _buildSuccess(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.mark_email_read_outlined,
          size: 80,
          color: AppColors.accentGreen,
        ),
        const SizedBox(height: AppSpacing.space6),
        Text(
          'Kod yuborildi',
          style: AppTextStyles.heading2.copyWith(
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: AppSpacing.space3),
        Text(
          '${_emailCtrl.text.trim()} manziliga tiklash kodi yuborildi',
          style: AppTextStyles.bodyLg.copyWith(color: AppColors.neutral400),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: AppSpacing.space8),
        AppButton(
          label: 'Parolni tiklash',
          onPressed: () => context.push(
            AppRoutes.resetPasswordRoute(_emailCtrl.text.trim()),
          ),
        ),
      ],
    );
  }
}
