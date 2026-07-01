// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'post_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

PostAuthorModel _$PostAuthorModelFromJson(Map<String, dynamic> json) {
  return _PostAuthorModel.fromJson(json);
}

/// @nodoc
mixin _$PostAuthorModel {
  String get id => throw _privateConstructorUsedError;
  String get displayName => throw _privateConstructorUsedError;
  String? get username => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  bool get isVerified => throw _privateConstructorUsedError;

  /// Serializes this PostAuthorModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PostAuthorModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PostAuthorModelCopyWith<PostAuthorModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PostAuthorModelCopyWith<$Res> {
  factory $PostAuthorModelCopyWith(
          PostAuthorModel value, $Res Function(PostAuthorModel) then) =
      _$PostAuthorModelCopyWithImpl<$Res, PostAuthorModel>;
  @useResult
  $Res call(
      {String id,
      String displayName,
      String? username,
      String? avatarUrl,
      bool isVerified});
}

/// @nodoc
class _$PostAuthorModelCopyWithImpl<$Res, $Val extends PostAuthorModel>
    implements $PostAuthorModelCopyWith<$Res> {
  _$PostAuthorModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PostAuthorModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? displayName = null,
    Object? username = freezed,
    Object? avatarUrl = freezed,
    Object? isVerified = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      displayName: null == displayName
          ? _value.displayName
          : displayName // ignore: cast_nullable_to_non_nullable
              as String,
      username: freezed == username
          ? _value.username
          : username // ignore: cast_nullable_to_non_nullable
              as String?,
      avatarUrl: freezed == avatarUrl
          ? _value.avatarUrl
          : avatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      isVerified: null == isVerified
          ? _value.isVerified
          : isVerified // ignore: cast_nullable_to_non_nullable
              as bool,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PostAuthorModelImplCopyWith<$Res>
    implements $PostAuthorModelCopyWith<$Res> {
  factory _$$PostAuthorModelImplCopyWith(_$PostAuthorModelImpl value,
          $Res Function(_$PostAuthorModelImpl) then) =
      __$$PostAuthorModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String displayName,
      String? username,
      String? avatarUrl,
      bool isVerified});
}

/// @nodoc
class __$$PostAuthorModelImplCopyWithImpl<$Res>
    extends _$PostAuthorModelCopyWithImpl<$Res, _$PostAuthorModelImpl>
    implements _$$PostAuthorModelImplCopyWith<$Res> {
  __$$PostAuthorModelImplCopyWithImpl(
      _$PostAuthorModelImpl _value, $Res Function(_$PostAuthorModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of PostAuthorModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? displayName = null,
    Object? username = freezed,
    Object? avatarUrl = freezed,
    Object? isVerified = null,
  }) {
    return _then(_$PostAuthorModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      displayName: null == displayName
          ? _value.displayName
          : displayName // ignore: cast_nullable_to_non_nullable
              as String,
      username: freezed == username
          ? _value.username
          : username // ignore: cast_nullable_to_non_nullable
              as String?,
      avatarUrl: freezed == avatarUrl
          ? _value.avatarUrl
          : avatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      isVerified: null == isVerified
          ? _value.isVerified
          : isVerified // ignore: cast_nullable_to_non_nullable
              as bool,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PostAuthorModelImpl implements _PostAuthorModel {
  const _$PostAuthorModelImpl(
      {required this.id,
      required this.displayName,
      this.username,
      this.avatarUrl,
      this.isVerified = false});

  factory _$PostAuthorModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PostAuthorModelImplFromJson(json);

  @override
  final String id;
  @override
  final String displayName;
  @override
  final String? username;
  @override
  final String? avatarUrl;
  @override
  @JsonKey()
  final bool isVerified;

  @override
  String toString() {
    return 'PostAuthorModel(id: $id, displayName: $displayName, username: $username, avatarUrl: $avatarUrl, isVerified: $isVerified)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PostAuthorModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.displayName, displayName) ||
                other.displayName == displayName) &&
            (identical(other.username, username) ||
                other.username == username) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.isVerified, isVerified) ||
                other.isVerified == isVerified));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, id, displayName, username, avatarUrl, isVerified);

  /// Create a copy of PostAuthorModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PostAuthorModelImplCopyWith<_$PostAuthorModelImpl> get copyWith =>
      __$$PostAuthorModelImplCopyWithImpl<_$PostAuthorModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PostAuthorModelImplToJson(
      this,
    );
  }
}

abstract class _PostAuthorModel implements PostAuthorModel {
  const factory _PostAuthorModel(
      {required final String id,
      required final String displayName,
      final String? username,
      final String? avatarUrl,
      final bool isVerified}) = _$PostAuthorModelImpl;

  factory _PostAuthorModel.fromJson(Map<String, dynamic> json) =
      _$PostAuthorModelImpl.fromJson;

  @override
  String get id;
  @override
  String get displayName;
  @override
  String? get username;
  @override
  String? get avatarUrl;
  @override
  bool get isVerified;

  /// Create a copy of PostAuthorModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PostAuthorModelImplCopyWith<_$PostAuthorModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PostModel _$PostModelFromJson(Map<String, dynamic> json) {
  return _PostModel.fromJson(json);
}

/// @nodoc
mixin _$PostModel {
  String get id => throw _privateConstructorUsedError;
  PostAuthorModel get author => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  List<String> get mediaUrls => throw _privateConstructorUsedError;
  int get likesCount => throw _privateConstructorUsedError;
  int get commentsCount => throw _privateConstructorUsedError;
  bool get isLiked => throw _privateConstructorUsedError;
  bool get isPinned => throw _privateConstructorUsedError;
  String? get groupId => throw _privateConstructorUsedError;
  String? get channelId => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;

  /// Serializes this PostModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PostModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PostModelCopyWith<PostModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PostModelCopyWith<$Res> {
  factory $PostModelCopyWith(PostModel value, $Res Function(PostModel) then) =
      _$PostModelCopyWithImpl<$Res, PostModel>;
  @useResult
  $Res call(
      {String id,
      PostAuthorModel author,
      String content,
      List<String> mediaUrls,
      int likesCount,
      int commentsCount,
      bool isLiked,
      bool isPinned,
      String? groupId,
      String? channelId,
      String createdAt});

  $PostAuthorModelCopyWith<$Res> get author;
}

/// @nodoc
class _$PostModelCopyWithImpl<$Res, $Val extends PostModel>
    implements $PostModelCopyWith<$Res> {
  _$PostModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PostModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? author = null,
    Object? content = null,
    Object? mediaUrls = null,
    Object? likesCount = null,
    Object? commentsCount = null,
    Object? isLiked = null,
    Object? isPinned = null,
    Object? groupId = freezed,
    Object? channelId = freezed,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      author: null == author
          ? _value.author
          : author // ignore: cast_nullable_to_non_nullable
              as PostAuthorModel,
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
      mediaUrls: null == mediaUrls
          ? _value.mediaUrls
          : mediaUrls // ignore: cast_nullable_to_non_nullable
              as List<String>,
      likesCount: null == likesCount
          ? _value.likesCount
          : likesCount // ignore: cast_nullable_to_non_nullable
              as int,
      commentsCount: null == commentsCount
          ? _value.commentsCount
          : commentsCount // ignore: cast_nullable_to_non_nullable
              as int,
      isLiked: null == isLiked
          ? _value.isLiked
          : isLiked // ignore: cast_nullable_to_non_nullable
              as bool,
      isPinned: null == isPinned
          ? _value.isPinned
          : isPinned // ignore: cast_nullable_to_non_nullable
              as bool,
      groupId: freezed == groupId
          ? _value.groupId
          : groupId // ignore: cast_nullable_to_non_nullable
              as String?,
      channelId: freezed == channelId
          ? _value.channelId
          : channelId // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }

  /// Create a copy of PostModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $PostAuthorModelCopyWith<$Res> get author {
    return $PostAuthorModelCopyWith<$Res>(_value.author, (value) {
      return _then(_value.copyWith(author: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PostModelImplCopyWith<$Res>
    implements $PostModelCopyWith<$Res> {
  factory _$$PostModelImplCopyWith(
          _$PostModelImpl value, $Res Function(_$PostModelImpl) then) =
      __$$PostModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      PostAuthorModel author,
      String content,
      List<String> mediaUrls,
      int likesCount,
      int commentsCount,
      bool isLiked,
      bool isPinned,
      String? groupId,
      String? channelId,
      String createdAt});

  @override
  $PostAuthorModelCopyWith<$Res> get author;
}

/// @nodoc
class __$$PostModelImplCopyWithImpl<$Res>
    extends _$PostModelCopyWithImpl<$Res, _$PostModelImpl>
    implements _$$PostModelImplCopyWith<$Res> {
  __$$PostModelImplCopyWithImpl(
      _$PostModelImpl _value, $Res Function(_$PostModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of PostModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? author = null,
    Object? content = null,
    Object? mediaUrls = null,
    Object? likesCount = null,
    Object? commentsCount = null,
    Object? isLiked = null,
    Object? isPinned = null,
    Object? groupId = freezed,
    Object? channelId = freezed,
    Object? createdAt = null,
  }) {
    return _then(_$PostModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      author: null == author
          ? _value.author
          : author // ignore: cast_nullable_to_non_nullable
              as PostAuthorModel,
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
      mediaUrls: null == mediaUrls
          ? _value._mediaUrls
          : mediaUrls // ignore: cast_nullable_to_non_nullable
              as List<String>,
      likesCount: null == likesCount
          ? _value.likesCount
          : likesCount // ignore: cast_nullable_to_non_nullable
              as int,
      commentsCount: null == commentsCount
          ? _value.commentsCount
          : commentsCount // ignore: cast_nullable_to_non_nullable
              as int,
      isLiked: null == isLiked
          ? _value.isLiked
          : isLiked // ignore: cast_nullable_to_non_nullable
              as bool,
      isPinned: null == isPinned
          ? _value.isPinned
          : isPinned // ignore: cast_nullable_to_non_nullable
              as bool,
      groupId: freezed == groupId
          ? _value.groupId
          : groupId // ignore: cast_nullable_to_non_nullable
              as String?,
      channelId: freezed == channelId
          ? _value.channelId
          : channelId // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PostModelImpl implements _PostModel {
  const _$PostModelImpl(
      {required this.id,
      required this.author,
      required this.content,
      final List<String> mediaUrls = const [],
      this.likesCount = 0,
      this.commentsCount = 0,
      this.isLiked = false,
      this.isPinned = false,
      this.groupId,
      this.channelId,
      required this.createdAt})
      : _mediaUrls = mediaUrls;

  factory _$PostModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$PostModelImplFromJson(json);

  @override
  final String id;
  @override
  final PostAuthorModel author;
  @override
  final String content;
  final List<String> _mediaUrls;
  @override
  @JsonKey()
  List<String> get mediaUrls {
    if (_mediaUrls is EqualUnmodifiableListView) return _mediaUrls;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_mediaUrls);
  }

  @override
  @JsonKey()
  final int likesCount;
  @override
  @JsonKey()
  final int commentsCount;
  @override
  @JsonKey()
  final bool isLiked;
  @override
  @JsonKey()
  final bool isPinned;
  @override
  final String? groupId;
  @override
  final String? channelId;
  @override
  final String createdAt;

  @override
  String toString() {
    return 'PostModel(id: $id, author: $author, content: $content, mediaUrls: $mediaUrls, likesCount: $likesCount, commentsCount: $commentsCount, isLiked: $isLiked, isPinned: $isPinned, groupId: $groupId, channelId: $channelId, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PostModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.author, author) || other.author == author) &&
            (identical(other.content, content) || other.content == content) &&
            const DeepCollectionEquality()
                .equals(other._mediaUrls, _mediaUrls) &&
            (identical(other.likesCount, likesCount) ||
                other.likesCount == likesCount) &&
            (identical(other.commentsCount, commentsCount) ||
                other.commentsCount == commentsCount) &&
            (identical(other.isLiked, isLiked) || other.isLiked == isLiked) &&
            (identical(other.isPinned, isPinned) ||
                other.isPinned == isPinned) &&
            (identical(other.groupId, groupId) || other.groupId == groupId) &&
            (identical(other.channelId, channelId) ||
                other.channelId == channelId) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      author,
      content,
      const DeepCollectionEquality().hash(_mediaUrls),
      likesCount,
      commentsCount,
      isLiked,
      isPinned,
      groupId,
      channelId,
      createdAt);

  /// Create a copy of PostModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PostModelImplCopyWith<_$PostModelImpl> get copyWith =>
      __$$PostModelImplCopyWithImpl<_$PostModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PostModelImplToJson(
      this,
    );
  }
}

abstract class _PostModel implements PostModel {
  const factory _PostModel(
      {required final String id,
      required final PostAuthorModel author,
      required final String content,
      final List<String> mediaUrls,
      final int likesCount,
      final int commentsCount,
      final bool isLiked,
      final bool isPinned,
      final String? groupId,
      final String? channelId,
      required final String createdAt}) = _$PostModelImpl;

  factory _PostModel.fromJson(Map<String, dynamic> json) =
      _$PostModelImpl.fromJson;

  @override
  String get id;
  @override
  PostAuthorModel get author;
  @override
  String get content;
  @override
  List<String> get mediaUrls;
  @override
  int get likesCount;
  @override
  int get commentsCount;
  @override
  bool get isLiked;
  @override
  bool get isPinned;
  @override
  String? get groupId;
  @override
  String? get channelId;
  @override
  String get createdAt;

  /// Create a copy of PostModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PostModelImplCopyWith<_$PostModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
