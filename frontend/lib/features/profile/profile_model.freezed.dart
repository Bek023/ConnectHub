// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'profile_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ProfileModel _$ProfileModelFromJson(Map<String, dynamic> json) {
  return _ProfileModel.fromJson(json);
}

/// @nodoc
mixin _$ProfileModel {
  String get id => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get displayName => throw _privateConstructorUsedError;
  String? get username => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  String? get bio => throw _privateConstructorUsedError;
  bool get isVerified => throw _privateConstructorUsedError;
  bool get twoFaEnabled => throw _privateConstructorUsedError;
  int get postsCount => throw _privateConstructorUsedError;
  int get goalsCount => throw _privateConstructorUsedError;
  int get groupsCount => throw _privateConstructorUsedError;
  bool get isFollowing => throw _privateConstructorUsedError;
  String? get createdAt => throw _privateConstructorUsedError;

  /// Serializes this ProfileModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProfileModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProfileModelCopyWith<ProfileModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProfileModelCopyWith<$Res> {
  factory $ProfileModelCopyWith(
          ProfileModel value, $Res Function(ProfileModel) then) =
      _$ProfileModelCopyWithImpl<$Res, ProfileModel>;
  @useResult
  $Res call(
      {String id,
      String email,
      String displayName,
      String? username,
      String? avatarUrl,
      String? bio,
      bool isVerified,
      bool twoFaEnabled,
      int postsCount,
      int goalsCount,
      int groupsCount,
      bool isFollowing,
      String? createdAt});
}

/// @nodoc
class _$ProfileModelCopyWithImpl<$Res, $Val extends ProfileModel>
    implements $ProfileModelCopyWith<$Res> {
  _$ProfileModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProfileModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? email = null,
    Object? displayName = null,
    Object? username = freezed,
    Object? avatarUrl = freezed,
    Object? bio = freezed,
    Object? isVerified = null,
    Object? twoFaEnabled = null,
    Object? postsCount = null,
    Object? goalsCount = null,
    Object? groupsCount = null,
    Object? isFollowing = null,
    Object? createdAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
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
      bio: freezed == bio
          ? _value.bio
          : bio // ignore: cast_nullable_to_non_nullable
              as String?,
      isVerified: null == isVerified
          ? _value.isVerified
          : isVerified // ignore: cast_nullable_to_non_nullable
              as bool,
      twoFaEnabled: null == twoFaEnabled
          ? _value.twoFaEnabled
          : twoFaEnabled // ignore: cast_nullable_to_non_nullable
              as bool,
      postsCount: null == postsCount
          ? _value.postsCount
          : postsCount // ignore: cast_nullable_to_non_nullable
              as int,
      goalsCount: null == goalsCount
          ? _value.goalsCount
          : goalsCount // ignore: cast_nullable_to_non_nullable
              as int,
      groupsCount: null == groupsCount
          ? _value.groupsCount
          : groupsCount // ignore: cast_nullable_to_non_nullable
              as int,
      isFollowing: null == isFollowing
          ? _value.isFollowing
          : isFollowing // ignore: cast_nullable_to_non_nullable
              as bool,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ProfileModelImplCopyWith<$Res>
    implements $ProfileModelCopyWith<$Res> {
  factory _$$ProfileModelImplCopyWith(
          _$ProfileModelImpl value, $Res Function(_$ProfileModelImpl) then) =
      __$$ProfileModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String email,
      String displayName,
      String? username,
      String? avatarUrl,
      String? bio,
      bool isVerified,
      bool twoFaEnabled,
      int postsCount,
      int goalsCount,
      int groupsCount,
      bool isFollowing,
      String? createdAt});
}

/// @nodoc
class __$$ProfileModelImplCopyWithImpl<$Res>
    extends _$ProfileModelCopyWithImpl<$Res, _$ProfileModelImpl>
    implements _$$ProfileModelImplCopyWith<$Res> {
  __$$ProfileModelImplCopyWithImpl(
      _$ProfileModelImpl _value, $Res Function(_$ProfileModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ProfileModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? email = null,
    Object? displayName = null,
    Object? username = freezed,
    Object? avatarUrl = freezed,
    Object? bio = freezed,
    Object? isVerified = null,
    Object? twoFaEnabled = null,
    Object? postsCount = null,
    Object? goalsCount = null,
    Object? groupsCount = null,
    Object? isFollowing = null,
    Object? createdAt = freezed,
  }) {
    return _then(_$ProfileModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
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
      bio: freezed == bio
          ? _value.bio
          : bio // ignore: cast_nullable_to_non_nullable
              as String?,
      isVerified: null == isVerified
          ? _value.isVerified
          : isVerified // ignore: cast_nullable_to_non_nullable
              as bool,
      twoFaEnabled: null == twoFaEnabled
          ? _value.twoFaEnabled
          : twoFaEnabled // ignore: cast_nullable_to_non_nullable
              as bool,
      postsCount: null == postsCount
          ? _value.postsCount
          : postsCount // ignore: cast_nullable_to_non_nullable
              as int,
      goalsCount: null == goalsCount
          ? _value.goalsCount
          : goalsCount // ignore: cast_nullable_to_non_nullable
              as int,
      groupsCount: null == groupsCount
          ? _value.groupsCount
          : groupsCount // ignore: cast_nullable_to_non_nullable
              as int,
      isFollowing: null == isFollowing
          ? _value.isFollowing
          : isFollowing // ignore: cast_nullable_to_non_nullable
              as bool,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ProfileModelImpl implements _ProfileModel {
  const _$ProfileModelImpl(
      {required this.id,
      required this.email,
      required this.displayName,
      this.username,
      this.avatarUrl,
      this.bio,
      this.isVerified = false,
      this.twoFaEnabled = false,
      this.postsCount = 0,
      this.goalsCount = 0,
      this.groupsCount = 0,
      this.isFollowing = false,
      this.createdAt});

  factory _$ProfileModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProfileModelImplFromJson(json);

  @override
  final String id;
  @override
  final String email;
  @override
  final String displayName;
  @override
  final String? username;
  @override
  final String? avatarUrl;
  @override
  final String? bio;
  @override
  @JsonKey()
  final bool isVerified;
  @override
  @JsonKey()
  final bool twoFaEnabled;
  @override
  @JsonKey()
  final int postsCount;
  @override
  @JsonKey()
  final int goalsCount;
  @override
  @JsonKey()
  final int groupsCount;
  @override
  @JsonKey()
  final bool isFollowing;
  @override
  final String? createdAt;

  @override
  String toString() {
    return 'ProfileModel(id: $id, email: $email, displayName: $displayName, username: $username, avatarUrl: $avatarUrl, bio: $bio, isVerified: $isVerified, twoFaEnabled: $twoFaEnabled, postsCount: $postsCount, goalsCount: $goalsCount, groupsCount: $groupsCount, isFollowing: $isFollowing, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProfileModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.displayName, displayName) ||
                other.displayName == displayName) &&
            (identical(other.username, username) ||
                other.username == username) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.bio, bio) || other.bio == bio) &&
            (identical(other.isVerified, isVerified) ||
                other.isVerified == isVerified) &&
            (identical(other.twoFaEnabled, twoFaEnabled) ||
                other.twoFaEnabled == twoFaEnabled) &&
            (identical(other.postsCount, postsCount) ||
                other.postsCount == postsCount) &&
            (identical(other.goalsCount, goalsCount) ||
                other.goalsCount == goalsCount) &&
            (identical(other.groupsCount, groupsCount) ||
                other.groupsCount == groupsCount) &&
            (identical(other.isFollowing, isFollowing) ||
                other.isFollowing == isFollowing) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      email,
      displayName,
      username,
      avatarUrl,
      bio,
      isVerified,
      twoFaEnabled,
      postsCount,
      goalsCount,
      groupsCount,
      isFollowing,
      createdAt);

  /// Create a copy of ProfileModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProfileModelImplCopyWith<_$ProfileModelImpl> get copyWith =>
      __$$ProfileModelImplCopyWithImpl<_$ProfileModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProfileModelImplToJson(
      this,
    );
  }
}

abstract class _ProfileModel implements ProfileModel {
  const factory _ProfileModel(
      {required final String id,
      required final String email,
      required final String displayName,
      final String? username,
      final String? avatarUrl,
      final String? bio,
      final bool isVerified,
      final bool twoFaEnabled,
      final int postsCount,
      final int goalsCount,
      final int groupsCount,
      final bool isFollowing,
      final String? createdAt}) = _$ProfileModelImpl;

  factory _ProfileModel.fromJson(Map<String, dynamic> json) =
      _$ProfileModelImpl.fromJson;

  @override
  String get id;
  @override
  String get email;
  @override
  String get displayName;
  @override
  String? get username;
  @override
  String? get avatarUrl;
  @override
  String? get bio;
  @override
  bool get isVerified;
  @override
  bool get twoFaEnabled;
  @override
  int get postsCount;
  @override
  int get goalsCount;
  @override
  int get groupsCount;
  @override
  bool get isFollowing;
  @override
  String? get createdAt;

  /// Create a copy of ProfileModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProfileModelImplCopyWith<_$ProfileModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
