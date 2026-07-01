import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'dart:convert';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/providers/theme_provider.dart';

class LockScreen extends ConsumerStatefulWidget {
  const LockScreen({super.key});

  @override
  ConsumerState<LockScreen> createState() => _LockScreenState();
}

class _LockScreenState extends ConsumerState<LockScreen> {
  var _pin = '';
  String? _error;
  static const _pinLength = 4;

  void _onDigit(String digit) {
    if (_pin.length >= _pinLength) return;
    setState(() {
      _pin += digit;
      _error = null;
    });
    if (_pin.length == _pinLength) _verify();
  }

  void _onDelete() {
    if (_pin.isEmpty) return;
    setState(() => _pin = _pin.substring(0, _pin.length - 1));
  }

  void _verify() {
    final prefs = ref.read(appPreferencesProvider);
    final storedHash = prefs.pinHash;
    if (storedHash == null) {
      context.go(AppRoutes.feed);
      return;
    }
    final inputHash = sha256.convert(utf8.encode(_pin)).toString();
    if (inputHash == storedHash) {
      context.go(AppRoutes.feed);
    } else {
      setState(() {
        _pin = '';
        _error = 'PIN noto\'g\'ri';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'PIN kod kiriting',
              style: AppTextStyles.heading2.copyWith(
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: AppSpacing.space8),
            _buildDots(),
            if (_error != null) ...[
              const SizedBox(height: AppSpacing.space3),
              Text(_error!, style: AppTextStyles.bodySmError),
            ],
            const SizedBox(height: AppSpacing.space10),
            _buildNumpad(),
          ],
        ),
      ),
    );
  }

  Widget _buildDots() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(_pinLength, (i) {
        final filled = i < _pin.length;
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: AppSpacing.space3),
          width: 16,
          height: 16,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: filled ? AppColors.primary : Colors.transparent,
            border: Border.all(
              color: filled ? AppColors.primary : AppColors.neutral400,
              width: 2,
            ),
          ),
        );
      }),
    );
  }

  Widget _buildNumpad() {
    return Column(
      children: [
        _buildRow(['1', '2', '3']),
        const SizedBox(height: AppSpacing.space4),
        _buildRow(['4', '5', '6']),
        const SizedBox(height: AppSpacing.space4),
        _buildRow(['7', '8', '9']),
        const SizedBox(height: AppSpacing.space4),
        _buildLastRow(),
      ],
    );
  }

  Widget _buildRow(List<String> digits) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: digits
          .map((d) => Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.space5),
                child: _NumpadButton(
                  label: d,
                  onTap: () => _onDigit(d),
                ),
              ))
          .toList(),
    );
  }

  Widget _buildLastRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const SizedBox(width: 80 + AppSpacing.space10),
        const SizedBox(width: AppSpacing.space10),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.space5),
          child: _NumpadButton(label: '0', onTap: () => _onDigit('0')),
        ),
        const SizedBox(width: AppSpacing.space10),
        SizedBox(
          width: 80,
          height: 80,
          child: IconButton(
            icon: const Icon(Icons.backspace_outlined),
            onPressed: _onDelete,
            iconSize: 28,
          ),
        ),
      ],
    );
  }
}

class _NumpadButton extends StatelessWidget {
  const _NumpadButton({required this.label, required this.onTap});

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Theme.of(context).colorScheme.surface,
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: AppTextStyles.heading2.copyWith(
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
      ),
    );
  }
}
