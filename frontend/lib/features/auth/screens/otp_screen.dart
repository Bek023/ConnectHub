import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../auth_notifier.dart';
import '../auth_repository.dart';

class OtpScreen extends ConsumerStatefulWidget {
  const OtpScreen({
    super.key,
    required this.userId,
    required this.email,
    this.twoFaToken,
  });

  final String userId;
  final String email;
  final String? twoFaToken;

  @override
  ConsumerState<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends ConsumerState<OtpScreen> {
  final _controllers = List.generate(6, (_) => TextEditingController());
  final _focusNodes = List.generate(6, (_) => FocusNode());
  bool _loading = false;
  String? _error;
  int _resendSeconds = 60;
  Timer? _timer;

  bool get _is2FA => widget.twoFaToken != null;

  @override
  void initState() {
    super.initState();
    _startResendTimer();
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => _focusNodes[0].requestFocus(),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  void _startResendTimer() {
    _timer?.cancel();
    setState(() => _resendSeconds = 60);
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_resendSeconds == 0) {
        t.cancel();
      } else {
        setState(() => _resendSeconds--);
      }
    });
  }

  String get _code => _controllers.map((c) => c.text).join();

  Future<void> _verify() async {
    if (_code.length < 6) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      if (_is2FA) {
        final result = await ref.read(authProvider.notifier).verify2FA(
              twoFaToken: widget.twoFaToken!,
              totpCode: _code,
            );
        if (!mounted) return;
        if (result is LoginSuccess) {
          context.go(AppRoutes.feed);
        }
      } else {
        await ref.read(authProvider.notifier).verifyEmail(
              userId: widget.userId,
              code: _code,
            );
        if (!mounted) return;
        context.go(AppRoutes.login);
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _resend() async {
    if (_resendSeconds > 0) return;
    try {
      await ref
          .read(authRepositoryProvider)
          .resendVerification(widget.userId);
      _startResendTimer();
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    }
  }

  void _onDigitChanged(int index, String value) {
    if (value.length == 1 && index < 5) {
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
    if (_code.length == 6) _verify();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_is2FA ? 'İki faktorli autentifikatsiya' : 'Email tasdiqlash'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.space6),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppSpacing.space4),
              Text(
                _is2FA
                    ? 'Autentifikator ilovasidagi kodni kiriting'
                    : '${widget.email} manziliga 6 ta raqamli kod yuborildi',
                style: AppTextStyles.bodyLg.copyWith(
                  color: AppColors.neutral400,
                ),
              ),
              const SizedBox(height: AppSpacing.space8),
              _buildOtpInput(),
              if (_error != null) ...[
                const SizedBox(height: AppSpacing.space3),
                Text(_error!, style: AppTextStyles.bodySmError),
              ],
              const SizedBox(height: AppSpacing.space6),
              AppButton(
                label: 'Tasdiqlash',
                onPressed: _code.length == 6 ? _verify : null,
                loading: _loading,
              ),
              if (!_is2FA) ...[
                const SizedBox(height: AppSpacing.space5),
                _buildResendRow(),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOtpInput() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(6, (i) => _buildDigitBox(i)),
    );
  }

  Widget _buildDigitBox(int index) {
    return SizedBox(
      width: 48,
      height: 56,
      child: TextFormField(
        controller: _controllers[index],
        focusNode: _focusNodes[index],
        textAlign: TextAlign.center,
        keyboardType: TextInputType.number,
        inputFormatters: [
          LengthLimitingTextInputFormatter(1),
          FilteringTextInputFormatter.digitsOnly,
        ],
        style: AppTextStyles.heading2,
        decoration: InputDecoration(
          contentPadding: EdgeInsets.zero,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppRadius.sm),
            borderSide: BorderSide(color: Theme.of(context).dividerColor),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppRadius.sm),
            borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
          ),
        ),
        onChanged: (v) => _onDigitChanged(index, v),
      ),
    );
  }

  Widget _buildResendRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Kelmadimi? ',
          style: AppTextStyles.bodyMd.copyWith(color: AppColors.neutral400),
        ),
        GestureDetector(
          onTap: _resendSeconds == 0 ? _resend : null,
          child: Text(
            _resendSeconds > 0 ? 'Qayta yuborish ($_resendSeconds s)' : 'Qayta yuborish',
            style: AppTextStyles.labelLg.copyWith(
              color: _resendSeconds == 0 ? AppColors.primary : AppColors.neutral400,
            ),
          ),
        ),
      ],
    );
  }
}
