// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'post_detail_notifier.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$postDetailHash() => r'c3e8ae6020de44adeacb751d54c6c8920a05e4af';

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

abstract class _$PostDetail
    extends BuildlessAutoDisposeAsyncNotifier<PostDetailState> {
  late final String postId;

  FutureOr<PostDetailState> build(
    String postId,
  );
}

/// See also [PostDetail].
@ProviderFor(PostDetail)
const postDetailProvider = PostDetailFamily();

/// See also [PostDetail].
class PostDetailFamily extends Family<AsyncValue<PostDetailState>> {
  /// See also [PostDetail].
  const PostDetailFamily();

  /// See also [PostDetail].
  PostDetailProvider call(
    String postId,
  ) {
    return PostDetailProvider(
      postId,
    );
  }

  @override
  PostDetailProvider getProviderOverride(
    covariant PostDetailProvider provider,
  ) {
    return call(
      provider.postId,
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
  String? get name => r'postDetailProvider';
}

/// See also [PostDetail].
class PostDetailProvider
    extends AutoDisposeAsyncNotifierProviderImpl<PostDetail, PostDetailState> {
  /// See also [PostDetail].
  PostDetailProvider(
    String postId,
  ) : this._internal(
          () => PostDetail()..postId = postId,
          from: postDetailProvider,
          name: r'postDetailProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$postDetailHash,
          dependencies: PostDetailFamily._dependencies,
          allTransitiveDependencies:
              PostDetailFamily._allTransitiveDependencies,
          postId: postId,
        );

  PostDetailProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.postId,
  }) : super.internal();

  final String postId;

  @override
  FutureOr<PostDetailState> runNotifierBuild(
    covariant PostDetail notifier,
  ) {
    return notifier.build(
      postId,
    );
  }

  @override
  Override overrideWith(PostDetail Function() create) {
    return ProviderOverride(
      origin: this,
      override: PostDetailProvider._internal(
        () => create()..postId = postId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        postId: postId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<PostDetail, PostDetailState>
      createElement() {
    return _PostDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is PostDetailProvider && other.postId == postId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, postId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin PostDetailRef on AutoDisposeAsyncNotifierProviderRef<PostDetailState> {
  /// The parameter `postId` of this provider.
  String get postId;
}

class _PostDetailProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<PostDetail, PostDetailState>
    with PostDetailRef {
  _PostDetailProviderElement(super.provider);

  @override
  String get postId => (origin as PostDetailProvider).postId;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
