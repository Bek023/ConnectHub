// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notifications_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$unreadNotificationsCountHash() =>
    r'72a4b27fc6ed92b5423221b074c1ce8029cb1ba5';

/// See also [unreadNotificationsCount].
@ProviderFor(unreadNotificationsCount)
final unreadNotificationsCountProvider = AutoDisposeProvider<int>.internal(
  unreadNotificationsCount,
  name: r'unreadNotificationsCountProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$unreadNotificationsCountHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef UnreadNotificationsCountRef = AutoDisposeProviderRef<int>;
String _$notificationsHash() => r'7b550db435d0c8ecf2adb0c24d2951fc68a3e04b';

/// See also [Notifications].
@ProviderFor(Notifications)
final notificationsProvider =
    AsyncNotifierProvider<Notifications, NotificationsState>.internal(
  Notifications.new,
  name: r'notificationsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$notificationsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$Notifications = AsyncNotifier<NotificationsState>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
