// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'groups_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$myGroupsHash() => r'77531d4dbd767c6e70b1a6c9297fd7b14d5f9a73';

/// See also [MyGroups].
@ProviderFor(MyGroups)
final myGroupsProvider =
    AutoDisposeAsyncNotifierProvider<MyGroups, List<GroupModel>>.internal(
  MyGroups.new,
  name: r'myGroupsProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$myGroupsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$MyGroups = AutoDisposeAsyncNotifier<List<GroupModel>>;
String _$groupDetailHash() => r'dd522a3168f556ca2801392577297465e2b532ad';

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

abstract class _$GroupDetail
    extends BuildlessAutoDisposeAsyncNotifier<GroupDetailState> {
  late final String groupId;

  FutureOr<GroupDetailState> build(
    String groupId,
  );
}

/// See also [GroupDetail].
@ProviderFor(GroupDetail)
const groupDetailProvider = GroupDetailFamily();

/// See also [GroupDetail].
class GroupDetailFamily extends Family<AsyncValue<GroupDetailState>> {
  /// See also [GroupDetail].
  const GroupDetailFamily();

  /// See also [GroupDetail].
  GroupDetailProvider call(
    String groupId,
  ) {
    return GroupDetailProvider(
      groupId,
    );
  }

  @override
  GroupDetailProvider getProviderOverride(
    covariant GroupDetailProvider provider,
  ) {
    return call(
      provider.groupId,
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
  String? get name => r'groupDetailProvider';
}

/// See also [GroupDetail].
class GroupDetailProvider extends AutoDisposeAsyncNotifierProviderImpl<
    GroupDetail, GroupDetailState> {
  /// See also [GroupDetail].
  GroupDetailProvider(
    String groupId,
  ) : this._internal(
          () => GroupDetail()..groupId = groupId,
          from: groupDetailProvider,
          name: r'groupDetailProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$groupDetailHash,
          dependencies: GroupDetailFamily._dependencies,
          allTransitiveDependencies:
              GroupDetailFamily._allTransitiveDependencies,
          groupId: groupId,
        );

  GroupDetailProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.groupId,
  }) : super.internal();

  final String groupId;

  @override
  FutureOr<GroupDetailState> runNotifierBuild(
    covariant GroupDetail notifier,
  ) {
    return notifier.build(
      groupId,
    );
  }

  @override
  Override overrideWith(GroupDetail Function() create) {
    return ProviderOverride(
      origin: this,
      override: GroupDetailProvider._internal(
        () => create()..groupId = groupId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        groupId: groupId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<GroupDetail, GroupDetailState>
      createElement() {
    return _GroupDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is GroupDetailProvider && other.groupId == groupId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, groupId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin GroupDetailRef on AutoDisposeAsyncNotifierProviderRef<GroupDetailState> {
  /// The parameter `groupId` of this provider.
  String get groupId;
}

class _GroupDetailProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<GroupDetail,
        GroupDetailState> with GroupDetailRef {
  _GroupDetailProviderElement(super.provider);

  @override
  String get groupId => (origin as GroupDetailProvider).groupId;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
