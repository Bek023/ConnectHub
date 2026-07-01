import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/auth/auth_notifier.dart';
import '../../shared/providers/theme_provider.dart';
import 'app_routes.dart';

String? appRedirect({
  required Ref ref,
  required String currentPath,
}) {
  final authValue = ref.read(authProvider);
  final prefs = ref.read(appPreferencesProvider);

  if (authValue.isLoading) {
    return currentPath == AppRoutes.splash ? null : AppRoutes.splash;
  }

  final isAuthenticated = authValue.valueOrNull != null;

  const publicPaths = {
    AppRoutes.splash,
    AppRoutes.welcome,
    AppRoutes.login,
    AppRoutes.register,
    AppRoutes.otp,
    AppRoutes.forgotPassword,
    AppRoutes.resetPassword,
  };

  const onboardingPaths = {
    AppRoutes.profileSetup,
    AppRoutes.goalSelection,
  };

  final isPublic = publicPaths.any((p) => currentPath.startsWith(p));
  final isOnboarding = onboardingPaths.contains(currentPath);

  if (!isAuthenticated) {
    return isPublic ? null : AppRoutes.welcome;
  }

  if (!prefs.onboardingDone) {
    if (isOnboarding) return null;
    return AppRoutes.profileSetup;
  }

  if (isPublic || currentPath == AppRoutes.splash) {
    return AppRoutes.feed;
  }

  return null;
}
