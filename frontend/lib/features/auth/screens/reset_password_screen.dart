import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../auth_repository.dart';

class ResetPasswordScreen extends ConsumerStatefulWidget {
  const ResetPasswordScreen({super.key, required this.email});

  final String email;

  @override
  ConsumerState<ResetPasswordScreen> createState() =>
      _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends ConsumerState<ResetPasswordScreen> {
  final _codeCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  bool _loading = false;
  bool _done = false;
  String? _error;

  @override
  void dispose() {
    _codeCtrl.dispose();
    _passwordCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final code = _codeCtrl.text.trim();
    final password = _passwordCtrl.text;
    final confirm = _confirmCtrl.text;

    if (code.length < 6) {
      setState(() => _error = 'Kod 6 ta raqam');
      return;
    }
    if (password.length < 8) {
      setState(() => _error = 'Parol kamida 8 ta belgi');
      return;
    }
    if (password != confirm) {
      setState(() => _error = 'Parollar mos emas');
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ref.read(authRepositoryProvider).resetPassword(
            email: widget.email,
            code: code,
            newPassword: password,
          );
      if (!mounted) return;
      setState(() => _done = true);
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Yangi parol')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.space6),
          child: _done ? _buildSuccess(context) : _buildForm(),
        ),
      ),
    );
  }

  Widget _buildForm() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: AppSpacing.space4),
          Text(
            '${widget.email} manziliga yuborilgan kodni kiriting',
            style: AppTextStyles.bodyLg.copyWith(color: AppColors.neutral400),
          ),
          const SizedBox(height: AppSpacing.space6),
          AppTextField(
            controller: _codeCtrl,
            label: 'Tasdiqlash kodi',
            hint: '123456',
            keyboardType: TextInputType.number,
            maxLength: 6,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: AppSpacing.space4),
          AppTextField(
            controller: _passwordCtrl,
            label: 'Yangi parol',
            hint: '••••••••',
            isPassword: true,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: AppSpacing.space4),
          AppTextField(
            controller: _confirmCtrl,
            label: 'Parolni tasdiqlash',
            hint: '••••••••',
            isPassword: true,
            textInputAction: TextInputAction.done,
            onSubmitted: (_) => _submit(),
          ),
          if (_error != null) ...[
            const SizedBox(height: AppSpacing.space3),
            Text(_error!, style: AppTextStyles.bodySmError),
          ],
          const SizedBox(height: AppSpacing.space6),
          AppButton(label: 'Saqlash', onPressed: _submit, loading: _loading),
        ],
      ),
    );
  }

  Widget _buildSuccess(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.lock_open_outlined,
          size: 80,
          color: AppColors.accentGreen,
        ),
        const SizedBox(height: AppSpacing.space6),
        Text(
          'Parol yangilandi',
          style: AppTextStyles.heading2.copyWith(
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
        const SizedBox(height: AppSpacing.space8),
        AppButton(
          label: 'Kirish',
          onPressed: () => context.go(AppRoutes.login),
        ),
      ],
    );
  }
}
