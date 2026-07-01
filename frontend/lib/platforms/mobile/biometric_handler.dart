import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:local_auth/local_auth.dart';

class BiometricHandler {
  static final _auth = LocalAuthentication();

  static bool get _isSupported {
    if (kIsWeb) return false;
    if (Platform.isLinux || Platform.isWindows) return false;
    return true;
  }

  static Future<bool> isAvailable() async {
    if (!_isSupported) return false;
    try {
      final canCheck = await _auth.canCheckBiometrics;
      if (!canCheck) return false;
      final types = await _auth.getAvailableBiometrics();
      return types.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  static Future<bool> authenticate({String? localizedReason}) async {
    if (!_isSupported) return false;
    try {
      return await _auth.authenticate(
        localizedReason:
            localizedReason ?? 'ConnectHub ga kirish uchun tasdiqlang',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false,
        ),
      );
    } catch (_) {
      return false;
    }
  }

  static Future<List<BiometricType>> getAvailableTypes() async {
    if (!_isSupported) return [];
    try {
      return await _auth.getAvailableBiometrics();
    } catch (_) {
      return [];
    }
  }

  static Future<bool> hasFingerprint() async {
    final types = await getAvailableTypes();
    return types.contains(BiometricType.fingerprint) ||
        types.contains(BiometricType.strong);
  }

  static Future<bool> hasFaceId() async {
    final types = await getAvailableTypes();
    return types.contains(BiometricType.face);
  }

  static Future<String> biometricLabel() async {
    if (await hasFaceId()) return 'Face ID';
    if (await hasFingerprint()) return 'Barmoq izi';
    return 'Biometrik';
  }
}
