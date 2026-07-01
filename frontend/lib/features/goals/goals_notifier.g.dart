// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'goals_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$trendingGoalsHash() => r'80dd48ac3b4bb49fe16893104ae547032061ff44';

/// See also [TrendingGoals].
@ProviderFor(TrendingGoals)
final trendingGoalsProvider =
    AutoDisposeAsyncNotifierProvider<TrendingGoals, List<GoalModel>>.internal(
  TrendingGoals.new,
  name: r'trendingGoalsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$trendingGoalsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$TrendingGoals = AutoDisposeAsyncNotifier<List<GoalModel>>;
String _$myGoalsHash() => r'749ae48f8506cfc27003fe5cd61c283a1c0e2472';

/// See also [MyGoals].
@ProviderFor(MyGoals)
final myGoalsProvider =
    AutoDisposeAsyncNotifierProvider<MyGoals, List<GoalModel>>.internal(
  MyGoals.new,
  name: r'myGoalsProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$myGoalsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$MyGoals = AutoDisposeAsyncNotifier<List<GoalModel>>;
String _$goalDetailHash() => r'8a8e2fd6d36d57f4ba1d8b1fa15ea167c39568f6';

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

abstract class _$GoalDetail
    extends BuildlessAutoDisposeAsyncNotifier<GoalModel> {
  late final String goalId;

  FutureOr<GoalModel> build(
    String goalId,
  );
}

/// See also [GoalDetail].
@ProviderFor(GoalDetail)
const goalDetailProvider = GoalDetailFamily();

/// See also [GoalDetail].
class GoalDetailFamily extends Family<AsyncValue<GoalModel>> {
  /// See also [GoalDetail].
  const GoalDetailFamily();

  /// See also [GoalDetail].
  GoalDetailProvider call(
    String goalId,
  ) {
    return GoalDetailProvider(
      goalId,
    );
  }

  @override
  GoalDetailProvider getProviderOverride(
    covariant GoalDetailProvider provider,
  ) {
    return call(
      provider.goalId,
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
  String? get name => r'goalDetailProvider';
}

/// See also [GoalDetail].
class GoalDetailProvider
    extends AutoDisposeAsyncNotifierProviderImpl<GoalDetail, GoalModel> {
  /// See also [GoalDetail].
  GoalDetailProvider(
    String goalId,
  ) : this._internal(
          () => GoalDetail()..goalId = goalId,
          from: goalDetailProvider,
          name: r'goalDetailProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$goalDetailHash,
          dependencies: GoalDetailFamily._dependencies,
          allTransitiveDependencies:
              GoalDetailFamily._allTransitiveDependencies,
          goalId: goalId,
        );

  GoalDetailProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.goalId,
  }) : super.internal();

  final String goalId;

  @override
  FutureOr<GoalModel> runNotifierBuild(
    covariant GoalDetail notifier,
  ) {
    return notifier.build(
      goalId,
    );
  }

  @override
  Override overrideWith(GoalDetail Function() create) {
    return ProviderOverride(
      origin: this,
      override: GoalDetailProvider._internal(
        () => create()..goalId = goalId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        goalId: goalId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<GoalDetail, GoalModel>
      createElement() {
    return _GoalDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is GoalDetailProvider && other.goalId == goalId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, goalId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin GoalDetailRef on AutoDisposeAsyncNotifierProviderRef<GoalModel> {
  /// The parameter `goalId` of this provider.
  String get goalId;
}

class _GoalDetailProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<GoalDetail, GoalModel>
    with GoalDetailRef {
  _GoalDetailProviderElement(super.provider);

  @override
  String get goalId => (origin as GoalDetailProvider).goalId;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
