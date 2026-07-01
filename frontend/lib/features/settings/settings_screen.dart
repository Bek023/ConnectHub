import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:local_auth/local_auth.dart';

import '../../core/router/app_routes.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_text_styles.dart';
import '../../shared/providers/locale_provider.dart';
import '../../shared/providers/theme_provider.dart';
import '../auth/auth_notifier.dart';
import '../auth/user_model.dart';
import 'settings_repository.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _biometricAvailable = false;
  bool _biometricEnabled = false;

  @override
  void initState() {
    super.initState();
    _loadMeta();
  }

  Future<void> _loadMeta() async {
    try {
      final auth = LocalAuthentication();
      final canCheck = await auth.canCheckBiometrics;
      final available =
          canCheck && (await auth.getAvailableBiometrics()).isNotEmpty;
      if (!mounted) return;
      setState(() {
        _biometricAvailable = available;
        _biometricEnabled = ref.read(appPreferencesProvider).biometricEnabled;
      });
    } catch (_) {}
  }

  Future<void> _toggleBiometric(bool value) async {
    if (value) {
      final auth = LocalAuthentication();
      final ok = await auth.authenticate(
        localizedReason: 'Biometrik autentifikatsiyani yoqish uchun tasdiqlang',
        options: const AuthenticationOptions(stickyAuth: true),
      );
      if (!ok) return;
    }
    await ref.read(appPreferencesProvider).setBiometricEnabled(value);
    setState(() => _biometricEnabled = value);
  }

  void _confirmDeleteAccount() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Hisobni o\'chirish'),
        content: const Text(
          'Bu amalni qaytarib bo\'lmaydi. Barcha ma\'lumotlaringiz o\'chiriladi.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Bekor qilish'),
          ),
          TextButton(
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            onPressed: () async {
              Navigator.pop(context);
              try {
                await ref.read(settingsRepositoryProvider).deleteAccount();
                await ref.read(authProvider.notifier).logout();
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                          e.toString().replaceFirst('Exception: ', '')),
                    ),
                  );
                }
              }
            },
            child: const Text('O\'chirish'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).valueOrNull;
    final prefs = ref.read(appPreferencesProvider);
    final hasPIN = prefs.pinHash != null;

    return Scaffold(
      appBar: AppBar(
        title: Text('Sozlamalar', style: AppTextStyles.heading3),
      ),
      body: ListView(
        children: [
          if (user != null) _UserHeader(user: user),
          _Section(title: 'Hisob', tiles: [
            _Tile(
              icon: Icons.lock_outlined,
              label: 'Parolni o\'zgartirish',
              onTap: () => context.push(AppRoutes.changePassword),
            ),
            _Tile(
              icon: Icons.verified_user_outlined,
              label: 'Ikki bosqichli autentifikatsiya',
              trailing: user?.twoFaEnabled == true
                  ? _Badge('Yoqilgan', AppColors.accentGreen)
                  : _Badge('O\'chirilgan', AppColors.neutral400),
              onTap: () => context.push(AppRoutes.twoFaSettings),
            ),
          ]),
          _Section(title: 'Xavfsizlik', tiles: [
            _Tile(
              icon: Icons.pin_outlined,
              label: 'PIN kod',
              trailing: hasPIN
                  ? _Badge('O\'rnatilgan', AppColors.accentGreen)
                  : null,
              onTap: () => context.push(AppRoutes.pinSetup),
            ),
            if (_biometricAvailable)
              _SwitchTile(
                icon: Icons.fingerprint_outlined,
                label: 'Biometrik',
                value: _biometricEnabled,
                onChanged: _toggleBiometric,
              ),
          ]),
          _Section(title: 'Ko\'rinish', tiles: [
            _Tile(
              icon: Icons.palette_outlined,
              label: 'Tema',
              trailing: _ThemeLabel(),
              onTap: () => context.push(AppRoutes.appearance),
            ),
            _Tile(
              icon: Icons.language_outlined,
              label: 'Til',
              trailing: _LocaleLabel(),
              onTap: () => context.push(AppRoutes.language),
            ),
          ]),
          _Section(title: 'Xavfli zona', tiles: [
            _Tile(
              icon: Icons.logout_outlined,
              label: 'Chiqish',
              color: AppColors.error,
              onTap: () => ref.read(authProvider.notifier).logout(),
            ),
            _Tile(
              icon: Icons.delete_forever_outlined,
              label: 'Hisobni o\'chirish',
              color: AppColors.error,
              onTap: _confirmDeleteAccount,
            ),
          ]),
          const SizedBox(height: AppSpacing.space4),
        ],
      ),
    );
  }
}

class _UserHeader extends StatelessWidget {
  const _UserHeader({required this.user});

  final UserModel user;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.space4),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: AppColors.primary.withValues(alpha: 0.2),
            backgroundImage: user.avatarUrl != null
                ? NetworkImage(user.avatarUrl!)
                : null,
            child: user.avatarUrl == null
                ? Text(
                    user.displayName.characters.first.toUpperCase(),
                    style: AppTextStyles.heading3.copyWith(
                      color: AppColors.primary,
                    ),
                  )
                : null,
          ),
          const SizedBox(width: AppSpacing.space3),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user.displayName,
                  style: AppTextStyles.labelLg.copyWith(
                    color: scheme.onSurface,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  user.email,
                  style: AppTextStyles.bodySm.copyWith(
                    color: AppColors.neutral400,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.tiles});

  final String title;
  final List<Widget> tiles;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
            AppSpacing.space4,
            AppSpacing.space4,
            AppSpacing.space4,
            AppSpacing.space2,
          ),
          child: Text(
            title.toUpperCase(),
            style: AppTextStyles.bodySm.copyWith(
              color: AppColors.neutral400,
              letterSpacing: 0.8,
            ),
          ),
        ),
        ...tiles,
      ],
    );
  }
}

class _Tile extends StatelessWidget {
  const _Tile({
    required this.icon,
    required this.label,
    this.trailing,
    this.color,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Widget? trailing;
  final Color? color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final c = color ?? scheme.onSurface;
    return ListTile(
      leading: Icon(icon, color: c, size: 22),
      title: Text(label, style: AppTextStyles.bodyMd.copyWith(color: c)),
      trailing: trailing ?? const Icon(Icons.chevron_right, size: 20),
      onTap: onTap,
    );
  }
}

class _SwitchTile extends StatelessWidget {
  const _SwitchTile({
    required this.icon,
    required this.label,
    required this.value,
    required this.onChanged,
  });

  final IconData icon;
  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, size: 22),
      title: Text(label, style: AppTextStyles.bodyMd),
      trailing: Switch(value: value, onChanged: onChanged),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge(this.label, this.color);

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: AppTextStyles.bodySm.copyWith(color: color),
    );
  }
}

class _ThemeLabel extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mode = ref.watch(themeModeProvider);
    final label = switch (mode) {
      ThemeMode.dark => 'Qorong\'u',
      ThemeMode.light => 'Yorug\'',
      ThemeMode.system => 'Tizim',
    };
    return Text(
      label,
      style: AppTextStyles.bodySm.copyWith(color: AppColors.neutral400),
    );
  }
}

class _LocaleLabel extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final code = ref.watch(localeProvider).languageCode;
    final label = switch (code) {
      'ru' => 'Русский',
      'en' => 'English',
      _ => "O'zbek",
    };
    return Text(
      label,
      style: AppTextStyles.bodySm.copyWith(color: AppColors.neutral400),
    );
  }
}
