// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'message_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

MessageModel _$MessageModelFromJson(Map<String, dynamic> json) {
  return _MessageModel.fromJson(json);
}

/// @nodoc
mixin _$MessageModel {
  String get id => throw _privateConstructorUsedError;
  String get chatType => throw _privateConstructorUsedError;
  String get chatId => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String? get mediaUrl => throw _privateConstructorUsedError;
  String get senderId => throw _privateConstructorUsedError;
  String get senderName => throw _privateConstructorUsedError;
  String? get senderAvatarUrl => throw _privateConstructorUsedError;
  List<ReactionModel> get reactions => throw _privateConstructorUsedError;
  String? get replyTo => throw _privateConstructorUsedError;
  bool get isRead => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this MessageModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MessageModelCopyWith<MessageModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MessageModelCopyWith<$Res> {
  factory $MessageModelCopyWith(
          MessageModel value, $Res Function(MessageModel) then) =
      _$MessageModelCopyWithImpl<$Res, MessageModel>;
  @useResult
  $Res call(
      {String id,
      String chatType,
      String chatId,
      String content,
      String type,
      String? mediaUrl,
      String senderId,
      String senderName,
      String? senderAvatarUrl,
      List<ReactionModel> reactions,
      String? replyTo,
      bool isRead,
      String createdAt,
      String? updatedAt});
}

/// @nodoc
class _$MessageModelCopyWithImpl<$Res, $Val extends MessageModel>
    implements $MessageModelCopyWith<$Res> {
  _$MessageModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? chatType = null,
    Object? chatId = null,
    Object? content = null,
    Object? type = null,
    Object? mediaUrl = freezed,
    Object? senderId = null,
    Object? senderName = null,
    Object? senderAvatarUrl = freezed,
    Object? reactions = null,
    Object? replyTo = freezed,
    Object? isRead = null,
    Object? createdAt = null,
    Object? updatedAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      chatType: null == chatType
          ? _value.chatType
          : chatType // ignore: cast_nullable_to_non_nullable
              as String,
      chatId: null == chatId
          ? _value.chatId
          : chatId // ignore: cast_nullable_to_non_nullable
              as String,
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      mediaUrl: freezed == mediaUrl
          ? _value.mediaUrl
          : mediaUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      senderId: null == senderId
          ? _value.senderId
          : senderId // ignore: cast_nullable_to_non_nullable
              as String,
      senderName: null == senderName
          ? _value.senderName
          : senderName // ignore: cast_nullable_to_non_nullable
              as String,
      senderAvatarUrl: freezed == senderAvatarUrl
          ? _value.senderAvatarUrl
          : senderAvatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      reactions: null == reactions
          ? _value.reactions
          : reactions // ignore: cast_nullable_to_non_nullable
              as List<ReactionModel>,
      replyTo: freezed == replyTo
          ? _value.replyTo
          : replyTo // ignore: cast_nullable_to_non_nullable
              as String?,
      isRead: null == isRead
          ? _value.isRead
          : isRead // ignore: cast_nullable_to_non_nullable
              as bool,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MessageModelImplCopyWith<$Res>
    implements $MessageModelCopyWith<$Res> {
  factory _$$MessageModelImplCopyWith(
          _$MessageModelImpl value, $Res Function(_$MessageModelImpl) then) =
      __$$MessageModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String chatType,
      String chatId,
      String content,
      String type,
      String? mediaUrl,
      String senderId,
      String senderName,
      String? senderAvatarUrl,
      List<ReactionModel> reactions,
      String? replyTo,
      bool isRead,
      String createdAt,
      String? updatedAt});
}

/// @nodoc
class __$$MessageModelImplCopyWithImpl<$Res>
    extends _$MessageModelCopyWithImpl<$Res, _$MessageModelImpl>
    implements _$$MessageModelImplCopyWith<$Res> {
  __$$MessageModelImplCopyWithImpl(
      _$MessageModelImpl _value, $Res Function(_$MessageModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? chatType = null,
    Object? chatId = null,
    Object? content = null,
    Object? type = null,
    Object? mediaUrl = freezed,
    Object? senderId = null,
    Object? senderName = null,
    Object? senderAvatarUrl = freezed,
    Object? reactions = null,
    Object? replyTo = freezed,
    Object? isRead = null,
    Object? createdAt = null,
    Object? updatedAt = freezed,
  }) {
    return _then(_$MessageModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      chatType: null == chatType
          ? _value.chatType
          : chatType // ignore: cast_nullable_to_non_nullable
              as String,
      chatId: null == chatId
          ? _value.chatId
          : chatId // ignore: cast_nullable_to_non_nullable
              as String,
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      mediaUrl: freezed == mediaUrl
          ? _value.mediaUrl
          : mediaUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      senderId: null == senderId
          ? _value.senderId
          : senderId // ignore: cast_nullable_to_non_nullable
              as String,
      senderName: null == senderName
          ? _value.senderName
          : senderName // ignore: cast_nullable_to_non_nullable
              as String,
      senderAvatarUrl: freezed == senderAvatarUrl
          ? _value.senderAvatarUrl
          : senderAvatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      reactions: null == reactions
          ? _value._reactions
          : reactions // ignore: cast_nullable_to_non_nullable
              as List<ReactionModel>,
      replyTo: freezed == replyTo
          ? _value.replyTo
          : replyTo // ignore: cast_nullable_to_non_nullable
              as String?,
      isRead: null == isRead
          ? _value.isRead
          : isRead // ignore: cast_nullable_to_non_nullable
              as bool,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MessageModelImpl implements _MessageModel {
  const _$MessageModelImpl(
      {required this.id,
      required this.chatType,
      required this.chatId,
      required this.content,
      this.type = 'text',
      this.mediaUrl,
      required this.senderId,
      required this.senderName,
      this.senderAvatarUrl,
      final List<ReactionModel> reactions = const [],
      this.replyTo,
      this.isRead = false,
      required this.createdAt,
      this.updatedAt})
      : _reactions = reactions;

  factory _$MessageModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$MessageModelImplFromJson(json);

  @override
  final String id;
  @override
  final String chatType;
  @override
  final String chatId;
  @override
  final String content;
  @override
  @JsonKey()
  final String type;
  @override
  final String? mediaUrl;
  @override
  final String senderId;
  @override
  final String senderName;
  @override
  final String? senderAvatarUrl;
  final List<ReactionModel> _reactions;
  @override
  @JsonKey()
  List<ReactionModel> get reactions {
    if (_reactions is EqualUnmodifiableListView) return _reactions;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_reactions);
  }

  @override
  final String? replyTo;
  @override
  @JsonKey()
  final bool isRead;
  @override
  final String createdAt;
  @override
  final String? updatedAt;

  @override
  String toString() {
    return 'MessageModel(id: $id, chatType: $chatType, chatId: $chatId, content: $content, type: $type, mediaUrl: $mediaUrl, senderId: $senderId, senderName: $senderName, senderAvatarUrl: $senderAvatarUrl, reactions: $reactions, replyTo: $replyTo, isRead: $isRead, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MessageModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.chatType, chatType) ||
                other.chatType == chatType) &&
            (identical(other.chatId, chatId) || other.chatId == chatId) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.mediaUrl, mediaUrl) ||
                other.mediaUrl == mediaUrl) &&
            (identical(other.senderId, senderId) ||
                other.senderId == senderId) &&
            (identical(other.senderName, senderName) ||
                other.senderName == senderName) &&
            (identical(other.senderAvatarUrl, senderAvatarUrl) ||
                other.senderAvatarUrl == senderAvatarUrl) &&
            const DeepCollectionEquality()
                .equals(other._reactions, _reactions) &&
            (identical(other.replyTo, replyTo) || other.replyTo == replyTo) &&
            (identical(other.isRead, isRead) || other.isRead == isRead) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      chatType,
      chatId,
      content,
      type,
      mediaUrl,
      senderId,
      senderName,
      senderAvatarUrl,
      const DeepCollectionEquality().hash(_reactions),
      replyTo,
      isRead,
      createdAt,
      updatedAt);

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MessageModelImplCopyWith<_$MessageModelImpl> get copyWith =>
      __$$MessageModelImplCopyWithImpl<_$MessageModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MessageModelImplToJson(
      this,
    );
  }
}

abstract class _MessageModel implements MessageModel {
  const factory _MessageModel(
      {required final String id,
      required final String chatType,
      required final String chatId,
      required final String content,
      final String type,
      final String? mediaUrl,
      required final String senderId,
      required final String senderName,
      final String? senderAvatarUrl,
      final List<ReactionModel> reactions,
      final String? replyTo,
      final bool isRead,
      required final String createdAt,
      final String? updatedAt}) = _$MessageModelImpl;

  factory _MessageModel.fromJson(Map<String, dynamic> json) =
      _$MessageModelImpl.fromJson;

  @override
  String get id;
  @override
  String get chatType;
  @override
  String get chatId;
  @override
  String get content;
  @override
  String get type;
  @override
  String? get mediaUrl;
  @override
  String get senderId;
  @override
  String get senderName;
  @override
  String? get senderAvatarUrl;
  @override
  List<ReactionModel> get reactions;
  @override
  String? get replyTo;
  @override
  bool get isRead;
  @override
  String get createdAt;
  @override
  String? get updatedAt;

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MessageModelImplCopyWith<_$MessageModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ReactionModel _$ReactionModelFromJson(Map<String, dynamic> json) {
  return _ReactionModel.fromJson(json);
}

/// @nodoc
mixin _$ReactionModel {
  String get emoji => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  String? get userName => throw _privateConstructorUsedError;

  /// Serializes this ReactionModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReactionModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReactionModelCopyWith<ReactionModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReactionModelCopyWith<$Res> {
  factory $ReactionModelCopyWith(
          ReactionModel value, $Res Function(ReactionModel) then) =
      _$ReactionModelCopyWithImpl<$Res, ReactionModel>;
  @useResult
  $Res call({String emoji, String userId, String? userName});
}

/// @nodoc
class _$ReactionModelCopyWithImpl<$Res, $Val extends ReactionModel>
    implements $ReactionModelCopyWith<$Res> {
  _$ReactionModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReactionModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? emoji = null,
    Object? userId = null,
    Object? userName = freezed,
  }) {
    return _then(_value.copyWith(
      emoji: null == emoji
          ? _value.emoji
          : emoji // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      userName: freezed == userName
          ? _value.userName
          : userName // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ReactionModelImplCopyWith<$Res>
    implements $ReactionModelCopyWith<$Res> {
  factory _$$ReactionModelImplCopyWith(
          _$ReactionModelImpl value, $Res Function(_$ReactionModelImpl) then) =
      __$$ReactionModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String emoji, String userId, String? userName});
}

/// @nodoc
class __$$ReactionModelImplCopyWithImpl<$Res>
    extends _$ReactionModelCopyWithImpl<$Res, _$ReactionModelImpl>
    implements _$$ReactionModelImplCopyWith<$Res> {
  __$$ReactionModelImplCopyWithImpl(
      _$ReactionModelImpl _value, $Res Function(_$ReactionModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ReactionModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? emoji = null,
    Object? userId = null,
    Object? userName = freezed,
  }) {
    return _then(_$ReactionModelImpl(
      emoji: null == emoji
          ? _value.emoji
          : emoji // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      userName: freezed == userName
          ? _value.userName
          : userName // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ReactionModelImpl implements _ReactionModel {
  const _$ReactionModelImpl(
      {required this.emoji, required this.userId, this.userName});

  factory _$ReactionModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReactionModelImplFromJson(json);

  @override
  final String emoji;
  @override
  final String userId;
  @override
  final String? userName;

  @override
  String toString() {
    return 'ReactionModel(emoji: $emoji, userId: $userId, userName: $userName)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReactionModelImpl &&
            (identical(other.emoji, emoji) || other.emoji == emoji) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.userName, userName) ||
                other.userName == userName));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, emoji, userId, userName);

  /// Create a copy of ReactionModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReactionModelImplCopyWith<_$ReactionModelImpl> get copyWith =>
      __$$ReactionModelImplCopyWithImpl<_$ReactionModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ReactionModelImplToJson(
      this,
    );
  }
}

abstract class _ReactionModel implements ReactionModel {
  const factory _ReactionModel(
      {required final String emoji,
      required final String userId,
      final String? userName}) = _$ReactionModelImpl;

  factory _ReactionModel.fromJson(Map<String, dynamic> json) =
      _$ReactionModelImpl.fromJson;

  @override
  String get emoji;
  @override
  String get userId;
  @override
  String? get userName;

  /// Create a copy of ReactionModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReactionModelImplCopyWith<_$ReactionModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
