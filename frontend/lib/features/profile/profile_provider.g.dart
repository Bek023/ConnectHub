// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'profile_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$myProfileHash() => r'ace5c79a39d40f690320ed3b37c8b3dabcf1b11b';

/// See also [MyProfile].
@ProviderFor(MyProfile)
final myProfileProvider =
    AsyncNotifierProvider<MyProfile, ProfileModel>.internal(
  MyProfile.new,
  name: r'myProfileProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$myProfileHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$MyProfile = AsyncNotifier<ProfileModel>;
String _$publicProfileHash() => r'5c95d39551d7737c39eb09531c6119405e0148c9';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

abstract class _$PublicProfile
    extends BuildlessAutoDisposeAsyncNotifier<ProfileModel> {
  late final String userId;

  FutureOr<ProfileModel> build(
    String userId,
  );
}

/// See also [PublicProfile].
@ProviderFor(PublicProfile)
const publicProfileProvider = PublicProfileFamily();

/// See also [PublicProfile].
class PublicProfileFamily extends Family<AsyncValue<ProfileModel>> {
  /// See also [PublicProfile].
  const PublicProfileFamily();

  /// See also [PublicProfile].
  PublicProfileProvider call(
    String userId,
  ) {
    return PublicProfileProvider(
      userId,
    );
  }

  @override
  PublicProfileProvider getProviderOverride(
    covariant PublicProfileProvider provider,
  ) {
    return call(
      provider.userId,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'publicProfileProvider';
}

/// See also [PublicProfile].
class PublicProfileProvider
    extends AutoDisposeAsyncNotifierProviderImpl<PublicProfile, ProfileModel> {
  /// See also [PublicProfile].
  PublicProfileProvider(
    String userId,
  ) : this._internal(
          () => PublicProfile()..userId = userId,
          from: publicProfileProvider,
          name: r'publicProfileProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$publicProfileHash,
          dependencies: PublicProfileFamily._dependencies,
          allTransitiveDependencies:
              PublicProfileFamily._allTransitiveDependencies,
          userId: userId,
        );

  PublicProfileProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.userId,
  }) : super.internal();

  final String userId;

  @override
  FutureOr<ProfileModel> runNotifierBuild(
    covariant PublicProfile notifier,
  ) {
    return notifier.build(
      userId,
    );
  }

  @override
  Override overrideWith(PublicProfile Function() create) {
    return ProviderOverride(
      origin: this,
      override: PublicProfileProvider._internal(
        () => create()..userId = userId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        userId: userId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<PublicProfile, ProfileModel>
      createElement() {
    return _PublicProfileProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is PublicProfileProvider && other.userId == userId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, userId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin PublicProfileRef on AutoDisposeAsyncNotifierProviderRef<ProfileModel> {
  /// The parameter `userId` of this provider.
  String get userId;
}

class _PublicProfileProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<PublicProfile, ProfileModel>
    with PublicProfileRef {
  _PublicProfileProviderElement(super.provider);

  @override
  String get userId => (origin as PublicProfileProvider).userId;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
