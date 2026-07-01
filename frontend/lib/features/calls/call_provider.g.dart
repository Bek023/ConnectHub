// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'call_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$activeCallHash() => r'559b42236b006050df4690f4a0e3ff465efba2ce';

/// See also [ActiveCall].
@ProviderFor(ActiveCall)
final activeCallProvider = NotifierProvider<ActiveCall, CallState>.internal(
  ActiveCall.new,
  name: r'activeCallProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$activeCallHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ActiveCall = Notifier<CallState>;
String _$callHistoryHash() => r'4fcef60f9d7d6260ee9bf5713c4526d05cbaf9ef';

/// See also [CallHistory].
@ProviderFor(CallHistory)
final callHistoryProvider =
    AutoDisposeAsyncNotifierProvider<CallHistory, List<CallModel>>.internal(
  CallHistory.new,
  name: r'callHistoryProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$callHistoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$CallHistory = AutoDisposeAsyncNotifier<List<CallModel>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
