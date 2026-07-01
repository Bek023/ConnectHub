import 'dart:convert';

import 'package:crypto/crypto.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/providers/theme_provider.dart';

class PinSetupScreen extends ConsumerStatefulWidget {
  const PinSetupScreen({super.key});

  @override
  ConsumerState<PinSetupScreen> createState() => _PinSetupScreenState();
}

class _PinSetupScreenState extends ConsumerState<PinSetupScreen> {
  static const _pinLength = 4;

  var _pin = '';
  var _confirmPin = '';
  bool _confirming = false;
  String? _error;

  void _onDigit(String digit) {
    if (_confirming) {
      if (_confirmPin.length >= _pinLength) return;
      setState(() {
        _confirmPin += digit;
        _error = null;
      });
      if (_confirmPin.length == _pinLength) _finalize();
    } else {
      if (_pin.length >= _pinLength) return;
      setState(() {
        _pin += digit;
        _error = null;
      });
      if (_pin.length == _pinLength) {
        setState(() => _confirming = true);
      }
    }
  }

  void _onDelete() {
    setState(() {
      if (_confirming) {
        if (_confirmPin.isNotEmpty) {
          _confirmPin = _confirmPin.substring(0, _confirmPin.length - 1);
        }
      } else {
        if (_pin.isNotEmpty) {
          _pin = _pin.substring(0, _pin.length - 1);
        }
      }
      _error = null;
    });
  }

  void _finalize() {
    if (_pin != _confirmPin) {
      setState(() {
        _error = 'PIN kodlar mos emas, qaytadan kiriting';
        _pin = '';
        _confirmPin = '';
        _confirming = false;
      });
      return;
    }
    final hash = sha256.convert(utf8.encode(_pin)).toString();
    ref.read(appPreferencesProvider).setPinHash(hash);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('PIN kod o\'rnatildi')),
      );
      Navigator.pop(context);
    }
  }

  void _removePin() {
    ref.read(appPreferencesProvider).setPinHash(null);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('PIN kod olib tashlandi')),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasPinSet =
        ref.read(appPreferencesProvider).pinHash != null;

    return Scaffold(
      appBar: AppBar(
        title: Text('PIN kod', style: AppTextStyles.heading3),
        actions: [
          if (hasPinSet)
            TextButton(
              onPressed: _removePin,
              child: const Text('O\'chirish'),
            ),
        ],
      ),
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              _confirming ? 'PIN kodni tasdiqlang' : 'Yangi PIN kiriting',
              style: AppTextStyles.heading3.copyWith(
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: AppSpacing.space8),
            _buildDots(),
            if (_error != null) ...[
              const SizedBox(height: AppSpacing.space3),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.space6),
                child: Text(
                  _error!,
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodySm.copyWith(
                    color: AppColors.error,
                  ),
                ),
              ),
            ],
            const SizedBox(height: AppSpacing.space10),
            _buildNumpad(),
          ],
        ),
      ),
    );
  }

  Widget _buildDots() {
    final current = _confirming ? _confirmPin : _pin;
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(_pinLength, (i) {
        final filled = i < current.length;
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
                padding:
                    const EdgeInsets.symmetric(horizontal: AppSpacing.space5),
                child: _NumpadBtn(label: d, onTap: () => _onDigit(d)),
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
          padding:
              const EdgeInsets.symmetric(horizontal: AppSpacing.space5),
          child: _NumpadBtn(label: '0', onTap: () => _onDigit('0')),
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

class _NumpadBtn extends StatelessWidget {
  const _NumpadBtn({required this.label, required this.onTap});

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
