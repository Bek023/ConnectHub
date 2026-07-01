import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/providers/theme_provider.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../auth_notifier.dart';

class ProfileSetupScreen extends ConsumerStatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  ConsumerState<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends ConsumerState<ProfileSetupScreen> {
  final _nameCtrl = TextEditingController();
  final _bioCtrl = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authProvider).valueOrNull;
    if (user != null) _nameCtrl.text = user.displayName;
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _bioCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (_nameCtrl.text.trim().isEmpty) {
      setState(() => _error = 'Ism kiritilmadi');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ref.read(authProvider.notifier).updateProfile(
            displayName: _nameCtrl.text.trim(),
            bio: _bioCtrl.text.trim().isEmpty ? null : _bioCtrl.text.trim(),
          );
      if (!mounted) return;
      context.go(AppRoutes.goalSelection);
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _skip() {
    ref.read(appPreferencesProvider).setOnboardingDone(true);
    context.go(AppRoutes.feed);
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).valueOrNull;

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Profilingizni to\'ldiring'),
        actions: [
          TextButton(
            onPressed: _skip,
            child: Text(
              'O\'tkazib yuborish',
              style: AppTextStyles.labelLg.copyWith(color: AppColors.primary),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.space6),
          child: Column(
            children: [
              const SizedBox(height: AppSpacing.space6),
              _buildAvatarPicker(user?.avatarUrl),
              const SizedBox(height: AppSpacing.space8),
              AppTextField(
                controller: _nameCtrl,
                label: 'To\'liq ism',
                hint: 'Ali Valiyev',
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: AppSpacing.space4),
              AppTextField(
                controller: _bioCtrl,
                label: 'Bio (ixtiyoriy)',
                hint: 'O\'zingiz haqingizda...',
                maxLines: 3,
                textInputAction: TextInputAction.done,
              ),
              if (_error != null) ...[
                const SizedBox(height: AppSpacing.space3),
                Text(_error!, style: AppTextStyles.bodySmError),
              ],
              const SizedBox(height: AppSpacing.space8),
              AppButton(
                label: 'Davom etish',
                onPressed: _save,
                loading: _loading,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAvatarPicker(String? avatarUrl) {
    return Stack(
      alignment: Alignment.center,
      children: [
        AppAvatar(
          imageUrl: avatarUrl,
          name: _nameCtrl.text,
          size: AppAvatarSize.xl,
        ),
        Positioned(
          right: 0,
          bottom: 0,
          child: GestureDetector(
            onTap: () {},
            child: Container(
              padding: const EdgeInsets.all(AppSpacing.space2),
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.camera_alt,
                size: 16,
                color: AppColors.white,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
