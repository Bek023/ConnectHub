// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'group_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

GroupModel _$GroupModelFromJson(Map<String, dynamic> json) {
  return _GroupModel.fromJson(json);
}

/// @nodoc
mixin _$GroupModel {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  String? get coverUrl => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  int get membersCount => throw _privateConstructorUsedError;
  bool get isJoined => throw _privateConstructorUsedError;
  String? get inviteCode => throw _privateConstructorUsedError;
  String? get myRole => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;

  /// Serializes this GroupModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GroupModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GroupModelCopyWith<GroupModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GroupModelCopyWith<$Res> {
  factory $GroupModelCopyWith(
          GroupModel value, $Res Function(GroupModel) then) =
      _$GroupModelCopyWithImpl<$Res, GroupModel>;
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      String? avatarUrl,
      String? coverUrl,
      String type,
      int membersCount,
      bool isJoined,
      String? inviteCode,
      String? myRole,
      String createdAt});
}

/// @nodoc
class _$GroupModelCopyWithImpl<$Res, $Val extends GroupModel>
    implements $GroupModelCopyWith<$Res> {
  _$GroupModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GroupModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = freezed,
    Object? avatarUrl = freezed,
    Object? coverUrl = freezed,
    Object? type = null,
    Object? membersCount = null,
    Object? isJoined = null,
    Object? inviteCode = freezed,
    Object? myRole = freezed,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      avatarUrl: freezed == avatarUrl
          ? _value.avatarUrl
          : avatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      coverUrl: freezed == coverUrl
          ? _value.coverUrl
          : coverUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      membersCount: null == membersCount
          ? _value.membersCount
          : membersCount // ignore: cast_nullable_to_non_nullable
              as int,
      isJoined: null == isJoined
          ? _value.isJoined
          : isJoined // ignore: cast_nullable_to_non_nullable
              as bool,
      inviteCode: freezed == inviteCode
          ? _value.inviteCode
          : inviteCode // ignore: cast_nullable_to_non_nullable
              as String?,
      myRole: freezed == myRole
          ? _value.myRole
          : myRole // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GroupModelImplCopyWith<$Res>
    implements $GroupModelCopyWith<$Res> {
  factory _$$GroupModelImplCopyWith(
          _$GroupModelImpl value, $Res Function(_$GroupModelImpl) then) =
      __$$GroupModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String title,
      String? description,
      String? avatarUrl,
      String? coverUrl,
      String type,
      int membersCount,
      bool isJoined,
      String? inviteCode,
      String? myRole,
      String createdAt});
}

/// @nodoc
class __$$GroupModelImplCopyWithImpl<$Res>
    extends _$GroupModelCopyWithImpl<$Res, _$GroupModelImpl>
    implements _$$GroupModelImplCopyWith<$Res> {
  __$$GroupModelImplCopyWithImpl(
      _$GroupModelImpl _value, $Res Function(_$GroupModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GroupModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = freezed,
    Object? avatarUrl = freezed,
    Object? coverUrl = freezed,
    Object? type = null,
    Object? membersCount = null,
    Object? isJoined = null,
    Object? inviteCode = freezed,
    Object? myRole = freezed,
    Object? createdAt = null,
  }) {
    return _then(_$GroupModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      avatarUrl: freezed == avatarUrl
          ? _value.avatarUrl
          : avatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      coverUrl: freezed == coverUrl
          ? _value.coverUrl
          : coverUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      membersCount: null == membersCount
          ? _value.membersCount
          : membersCount // ignore: cast_nullable_to_non_nullable
              as int,
      isJoined: null == isJoined
          ? _value.isJoined
          : isJoined // ignore: cast_nullable_to_non_nullable
              as bool,
      inviteCode: freezed == inviteCode
          ? _value.inviteCode
          : inviteCode // ignore: cast_nullable_to_non_nullable
              as String?,
      myRole: freezed == myRole
          ? _value.myRole
          : myRole // ignore: cast_nullable_to_non_nullable
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
class _$GroupModelImpl implements _GroupModel {
  const _$GroupModelImpl(
      {required this.id,
      required this.title,
      this.description,
      this.avatarUrl,
      this.coverUrl,
      this.type = 'public',
      this.membersCount = 0,
      this.isJoined = false,
      this.inviteCode,
      this.myRole,
      required this.createdAt});

  factory _$GroupModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GroupModelImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String? description;
  @override
  final String? avatarUrl;
  @override
  final String? coverUrl;
  @override
  @JsonKey()
  final String type;
  @override
  @JsonKey()
  final int membersCount;
  @override
  @JsonKey()
  final bool isJoined;
  @override
  final String? inviteCode;
  @override
  final String? myRole;
  @override
  final String createdAt;

  @override
  String toString() {
    return 'GroupModel(id: $id, title: $title, description: $description, avatarUrl: $avatarUrl, coverUrl: $coverUrl, type: $type, membersCount: $membersCount, isJoined: $isJoined, inviteCode: $inviteCode, myRole: $myRole, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GroupModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.coverUrl, coverUrl) ||
                other.coverUrl == coverUrl) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.membersCount, membersCount) ||
                other.membersCount == membersCount) &&
            (identical(other.isJoined, isJoined) ||
                other.isJoined == isJoined) &&
            (identical(other.inviteCode, inviteCode) ||
                other.inviteCode == inviteCode) &&
            (identical(other.myRole, myRole) || other.myRole == myRole) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      title,
      description,
      avatarUrl,
      coverUrl,
      type,
      membersCount,
      isJoined,
      inviteCode,
      myRole,
      createdAt);

  /// Create a copy of GroupModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GroupModelImplCopyWith<_$GroupModelImpl> get copyWith =>
      __$$GroupModelImplCopyWithImpl<_$GroupModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GroupModelImplToJson(
      this,
    );
  }
}

abstract class _GroupModel implements GroupModel {
  const factory _GroupModel(
      {required final String id,
      required final String title,
      final String? description,
      final String? avatarUrl,
      final String? coverUrl,
      final String type,
      final int membersCount,
      final bool isJoined,
      final String? inviteCode,
      final String? myRole,
      required final String createdAt}) = _$GroupModelImpl;

  factory _GroupModel.fromJson(Map<String, dynamic> json) =
      _$GroupModelImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String? get description;
  @override
  String? get avatarUrl;
  @override
  String? get coverUrl;
  @override
  String get type;
  @override
  int get membersCount;
  @override
  bool get isJoined;
  @override
  String? get inviteCode;
  @override
  String? get myRole;
  @override
  String get createdAt;

  /// Create a copy of GroupModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GroupModelImplCopyWith<_$GroupModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

GroupMemberModel _$GroupMemberModelFromJson(Map<String, dynamic> json) {
  return _GroupMemberModel.fromJson(json);
}

/// @nodoc
mixin _$GroupMemberModel {
  String get id => throw _privateConstructorUsedError;
  String get displayName => throw _privateConstructorUsedError;
  String? get username => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  String get role => throw _privateConstructorUsedError;
  String get joinedAt => throw _privateConstructorUsedError;

  /// Serializes this GroupMemberModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GroupMemberModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GroupMemberModelCopyWith<GroupMemberModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GroupMemberModelCopyWith<$Res> {
  factory $GroupMemberModelCopyWith(
          GroupMemberModel value, $Res Function(GroupMemberModel) then) =
      _$GroupMemberModelCopyWithImpl<$Res, GroupMemberModel>;
  @useResult
  $Res call(
      {String id,
      String displayName,
      String? username,
      String? avatarUrl,
      String role,
      String joinedAt});
}

/// @nodoc
class _$GroupMemberModelCopyWithImpl<$Res, $Val extends GroupMemberModel>
    implements $GroupMemberModelCopyWith<$Res> {
  _$GroupMemberModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GroupMemberModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? displayName = null,
    Object? username = freezed,
    Object? avatarUrl = freezed,
    Object? role = null,
    Object? joinedAt = null,
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
      role: null == role
          ? _value.role
          : role // ignore: cast_nullable_to_non_nullable
              as String,
      joinedAt: null == joinedAt
          ? _value.joinedAt
          : joinedAt // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$GroupMemberModelImplCopyWith<$Res>
    implements $GroupMemberModelCopyWith<$Res> {
  factory _$$GroupMemberModelImplCopyWith(_$GroupMemberModelImpl value,
          $Res Function(_$GroupMemberModelImpl) then) =
      __$$GroupMemberModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String displayName,
      String? username,
      String? avatarUrl,
      String role,
      String joinedAt});
}

/// @nodoc
class __$$GroupMemberModelImplCopyWithImpl<$Res>
    extends _$GroupMemberModelCopyWithImpl<$Res, _$GroupMemberModelImpl>
    implements _$$GroupMemberModelImplCopyWith<$Res> {
  __$$GroupMemberModelImplCopyWithImpl(_$GroupMemberModelImpl _value,
      $Res Function(_$GroupMemberModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of GroupMemberModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? displayName = null,
    Object? username = freezed,
    Object? avatarUrl = freezed,
    Object? role = null,
    Object? joinedAt = null,
  }) {
    return _then(_$GroupMemberModelImpl(
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
      role: null == role
          ? _value.role
          : role // ignore: cast_nullable_to_non_nullable
              as String,
      joinedAt: null == joinedAt
          ? _value.joinedAt
          : joinedAt // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$GroupMemberModelImpl implements _GroupMemberModel {
  const _$GroupMemberModelImpl(
      {required this.id,
      required this.displayName,
      this.username,
      this.avatarUrl,
      this.role = 'member',
      required this.joinedAt});

  factory _$GroupMemberModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$GroupMemberModelImplFromJson(json);

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
  final String role;
  @override
  final String joinedAt;

  @override
  String toString() {
    return 'GroupMemberModel(id: $id, displayName: $displayName, username: $username, avatarUrl: $avatarUrl, role: $role, joinedAt: $joinedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GroupMemberModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.displayName, displayName) ||
                other.displayName == displayName) &&
            (identical(other.username, username) ||
                other.username == username) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.role, role) || other.role == role) &&
            (identical(other.joinedAt, joinedAt) ||
                other.joinedAt == joinedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, id, displayName, username, avatarUrl, role, joinedAt);

  /// Create a copy of GroupMemberModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GroupMemberModelImplCopyWith<_$GroupMemberModelImpl> get copyWith =>
      __$$GroupMemberModelImplCopyWithImpl<_$GroupMemberModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GroupMemberModelImplToJson(
      this,
    );
  }
}

abstract class _GroupMemberModel implements GroupMemberModel {
  const factory _GroupMemberModel(
      {required final String id,
      required final String displayName,
      final String? username,
      final String? avatarUrl,
      final String role,
      required final String joinedAt}) = _$GroupMemberModelImpl;

  factory _GroupMemberModel.fromJson(Map<String, dynamic> json) =
      _$GroupMemberModelImpl.fromJson;

  @override
  String get id;
  @override
  String get displayName;
  @override
  String? get username;
  @override
  String? get avatarUrl;
  @override
  String get role;
  @override
  String get joinedAt;

  /// Create a copy of GroupMemberModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GroupMemberModelImplCopyWith<_$GroupMemberModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
