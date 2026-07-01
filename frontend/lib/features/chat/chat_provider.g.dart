// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$chatHash() => r'3e90955ae1418ab27dfb35c0e9479a58d8a618e1';

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

abstract class _$Chat extends BuildlessAutoDisposeAsyncNotifier<ChatState> {
  late final String chatType;
  late final String chatId;

  FutureOr<ChatState> build(
    String chatType,
    String chatId,
  );
}

/// See also [Chat].
@ProviderFor(Chat)
const chatProvider = ChatFamily();

/// See also [Chat].
class ChatFamily extends Family<AsyncValue<ChatState>> {
  /// See also [Chat].
  const ChatFamily();

  /// See also [Chat].
  ChatProvider call(
    String chatType,
    String chatId,
  ) {
    return ChatProvider(
      chatType,
      chatId,
    );
  }

  @override
  ChatProvider getProviderOverride(
    covariant ChatProvider provider,
  ) {
    return call(
      provider.chatType,
      provider.chatId,
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
  String? get name => r'chatProvider';
}

/// See also [Chat].
class ChatProvider
    extends AutoDisposeAsyncNotifierProviderImpl<Chat, ChatState> {
  /// See also [Chat].
  ChatProvider(
    String chatType,
    String chatId,
  ) : this._internal(
          () => Chat()
            ..chatType = chatType
            ..chatId = chatId,
          from: chatProvider,
          name: r'chatProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product') ? null : _$chatHash,
          dependencies: ChatFamily._dependencies,
          allTransitiveDependencies: ChatFamily._allTransitiveDependencies,
          chatType: chatType,
          chatId: chatId,
        );

  ChatProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.chatType,
    required this.chatId,
  }) : super.internal();

  final String chatType;
  final String chatId;

  @override
  FutureOr<ChatState> runNotifierBuild(
    covariant Chat notifier,
  ) {
    return notifier.build(
      chatType,
      chatId,
    );
  }

  @override
  Override overrideWith(Chat Function() create) {
    return ProviderOverride(
      origin: this,
      override: ChatProvider._internal(
        () => create()
          ..chatType = chatType
          ..chatId = chatId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        chatType: chatType,
        chatId: chatId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<Chat, ChatState> createElement() {
    return _ChatProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ChatProvider &&
        other.chatType == chatType &&
        other.chatId == chatId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, chatType.hashCode);
    hash = _SystemHash.combine(hash, chatId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ChatRef on AutoDisposeAsyncNotifierProviderRef<ChatState> {
  /// The parameter `chatType` of this provider.
  String get chatType;

  /// The parameter `chatId` of this provider.
  String get chatId;
}

class _ChatProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<Chat, ChatState>
    with ChatRef {
  _ChatProviderElement(super.provider);

  @override
  String get chatType => (origin as ChatProvider).chatType;
  @override
  String get chatId => (origin as ChatProvider).chatId;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
