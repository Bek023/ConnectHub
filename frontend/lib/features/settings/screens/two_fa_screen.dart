import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../../auth/auth_notifier.dart';
import '../settings_repository.dart';

class TwoFaScreen extends ConsumerStatefulWidget {
  const TwoFaScreen({super.key});

  @override
  ConsumerState<TwoFaScreen> createState() => _TwoFaScreenState();
}

class _TwoFaScreenState extends ConsumerState<TwoFaScreen> {
  final _codeCtrl = TextEditingController();
  bool _loading = false;
  bool _setupLoading = false;
  String? _otpauthUrl;

  bool get _isEnabled =>
      ref.watch(authProvider).valueOrNull?.twoFaEnabled ?? false;

  @override
  void initState() {
    super.initState();
    if (!_isEnabled) _loadSetup();
  }

  @override
  void dispose() {
    _codeCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadSetup() async {
    setState(() => _setupLoading = true);
    try {
      final url = await ref.read(settingsRepositoryProvider).setup2FA();
      if (mounted) setState(() => _otpauthUrl = url);
    } catch (_) {
    } finally {
      if (mounted) setState(() => _setupLoading = false);
    }
  }

  Future<void> _toggle() async {
    if (_codeCtrl.text.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('6 raqamli kod kiriting')),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      final repo = ref.read(settingsRepositoryProvider);
      if (_isEnabled) {
        await repo.disable2FA(_codeCtrl.text);
      } else {
        await repo.enable2FA(_codeCtrl.text);
      }
      await ref.read(authProvider.notifier).logout();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _isEnabled ? '2FA o\'chirildi' : '2FA yoqildi. Qayta kiring.',
            ),
          ),
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
        title: Text('Ikki bosqichli autentifikatsiya',
            style: AppTextStyles.heading3),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.space4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _StatusBadge(enabled: _isEnabled),
            const SizedBox(height: AppSpacing.space4),
            Text(
              _isEnabled
                  ? '2FA o\'chirish uchun autentifikator ilovangizdan kodingizni kiriting.'
                  : '2FA yoqish uchun autentifikator ilovangizni quyidagi URI bilan sozlang.',
              style: AppTextStyles.bodyMd.copyWith(
                color:
                    Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7),
              ),
            ),
            if (!_isEnabled) ...[
              const SizedBox(height: AppSpacing.space4),
              _OtpUriCard(
                url: _otpauthUrl,
                isLoading: _setupLoading,
              ),
            ],
            const SizedBox(height: AppSpacing.space6),
            AppTextField(
              controller: _codeCtrl,
              label: '6 raqamli TOTP kod',
              keyboardType: TextInputType.number,
              maxLines: 1,
            ),
            const SizedBox(height: AppSpacing.space4),
            AppButton(
              label: _isEnabled ? '2FA ni o\'chirish' : '2FA ni yoqish',
              onPressed: _loading ? null : _toggle,
              loading: _loading,
              variant:
                  _isEnabled ? AppButtonVariant.outlined : AppButtonVariant.primary,
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.enabled});

  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space3,
        vertical: AppSpacing.space1,
      ),
      decoration: BoxDecoration(
        color: (enabled ? AppColors.accentGreen : AppColors.neutral700)
            .withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(AppRadius.full),
      ),
      child: Text(
        enabled ? 'Yoqilgan' : 'O\'chirilgan',
        style: AppTextStyles.labelSm.copyWith(
          color: enabled ? AppColors.accentGreen : AppColors.neutral400,
        ),
      ),
    );
  }
}

class _OtpUriCard extends StatelessWidget {
  const _OtpUriCard({this.url, required this.isLoading});

  final String? url;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (url == null) return const SizedBox.shrink();
    return GestureDetector(
      onTap: () {
        Clipboard.setData(ClipboardData(text: url!));
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('URI nusxalandi')),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.space3),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'OTP URI (nusxalash uchun bosing)',
              style: AppTextStyles.labelSm.copyWith(
                color: AppColors.neutral400,
              ),
            ),
            const SizedBox(height: AppSpacing.space2),
            Text(
              url!,
              style: AppTextStyles.mono.copyWith(fontSize: 11),
              maxLines: 4,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
