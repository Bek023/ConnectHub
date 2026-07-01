// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'call_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CallModel _$CallModelFromJson(Map<String, dynamic> json) {
  return _CallModel.fromJson(json);
}

/// @nodoc
mixin _$CallModel {
  String get id => throw _privateConstructorUsedError;
  String get chatId => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get initiatorId => throw _privateConstructorUsedError;
  String? get initiatorName => throw _privateConstructorUsedError;
  String? get initiatorAvatarUrl => throw _privateConstructorUsedError;
  List<CallParticipantModel> get participants =>
      throw _privateConstructorUsedError;
  String? get startedAt => throw _privateConstructorUsedError;
  String? get endedAt => throw _privateConstructorUsedError;
  String? get createdAt => throw _privateConstructorUsedError;

  /// Serializes this CallModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CallModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CallModelCopyWith<CallModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CallModelCopyWith<$Res> {
  factory $CallModelCopyWith(CallModel value, $Res Function(CallModel) then) =
      _$CallModelCopyWithImpl<$Res, CallModel>;
  @useResult
  $Res call(
      {String id,
      String chatId,
      String type,
      String status,
      String initiatorId,
      String? initiatorName,
      String? initiatorAvatarUrl,
      List<CallParticipantModel> participants,
      String? startedAt,
      String? endedAt,
      String? createdAt});
}

/// @nodoc
class _$CallModelCopyWithImpl<$Res, $Val extends CallModel>
    implements $CallModelCopyWith<$Res> {
  _$CallModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CallModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? chatId = null,
    Object? type = null,
    Object? status = null,
    Object? initiatorId = null,
    Object? initiatorName = freezed,
    Object? initiatorAvatarUrl = freezed,
    Object? participants = null,
    Object? startedAt = freezed,
    Object? endedAt = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      chatId: null == chatId
          ? _value.chatId
          : chatId // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      initiatorId: null == initiatorId
          ? _value.initiatorId
          : initiatorId // ignore: cast_nullable_to_non_nullable
              as String,
      initiatorName: freezed == initiatorName
          ? _value.initiatorName
          : initiatorName // ignore: cast_nullable_to_non_nullable
              as String?,
      initiatorAvatarUrl: freezed == initiatorAvatarUrl
          ? _value.initiatorAvatarUrl
          : initiatorAvatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      participants: null == participants
          ? _value.participants
          : participants // ignore: cast_nullable_to_non_nullable
              as List<CallParticipantModel>,
      startedAt: freezed == startedAt
          ? _value.startedAt
          : startedAt // ignore: cast_nullable_to_non_nullable
              as String?,
      endedAt: freezed == endedAt
          ? _value.endedAt
          : endedAt // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CallModelImplCopyWith<$Res>
    implements $CallModelCopyWith<$Res> {
  factory _$$CallModelImplCopyWith(
          _$CallModelImpl value, $Res Function(_$CallModelImpl) then) =
      __$$CallModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String chatId,
      String type,
      String status,
      String initiatorId,
      String? initiatorName,
      String? initiatorAvatarUrl,
      List<CallParticipantModel> participants,
      String? startedAt,
      String? endedAt,
      String? createdAt});
}

/// @nodoc
class __$$CallModelImplCopyWithImpl<$Res>
    extends _$CallModelCopyWithImpl<$Res, _$CallModelImpl>
    implements _$$CallModelImplCopyWith<$Res> {
  __$$CallModelImplCopyWithImpl(
      _$CallModelImpl _value, $Res Function(_$CallModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CallModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? chatId = null,
    Object? type = null,
    Object? status = null,
    Object? initiatorId = null,
    Object? initiatorName = freezed,
    Object? initiatorAvatarUrl = freezed,
    Object? participants = null,
    Object? startedAt = freezed,
    Object? endedAt = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(_$CallModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      chatId: null == chatId
          ? _value.chatId
          : chatId // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      initiatorId: null == initiatorId
          ? _value.initiatorId
          : initiatorId // ignore: cast_nullable_to_non_nullable
              as String,
      initiatorName: freezed == initiatorName
          ? _value.initiatorName
          : initiatorName // ignore: cast_nullable_to_non_nullable
              as String?,
      initiatorAvatarUrl: freezed == initiatorAvatarUrl
          ? _value.initiatorAvatarUrl
          : initiatorAvatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      participants: null == participants
          ? _value._participants
          : participants // ignore: cast_nullable_to_non_nullable
              as List<CallParticipantModel>,
      startedAt: freezed == startedAt
          ? _value.startedAt
          : startedAt // ignore: cast_nullable_to_non_nullable
              as String?,
      endedAt: freezed == endedAt
          ? _value.endedAt
          : endedAt // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CallModelImpl implements _CallModel {
  const _$CallModelImpl(
      {required this.id,
      required this.chatId,
      this.type = 'audio',
      this.status = 'pending',
      required this.initiatorId,
      this.initiatorName,
      this.initiatorAvatarUrl,
      final List<CallParticipantModel> participants = const [],
      this.startedAt,
      this.endedAt,
      this.createdAt})
      : _participants = participants;

  factory _$CallModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CallModelImplFromJson(json);

  @override
  final String id;
  @override
  final String chatId;
  @override
  @JsonKey()
  final String type;
  @override
  @JsonKey()
  final String status;
  @override
  final String initiatorId;
  @override
  final String? initiatorName;
  @override
  final String? initiatorAvatarUrl;
  final List<CallParticipantModel> _participants;
  @override
  @JsonKey()
  List<CallParticipantModel> get participants {
    if (_participants is EqualUnmodifiableListView) return _participants;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_participants);
  }

  @override
  final String? startedAt;
  @override
  final String? endedAt;
  @override
  final String? createdAt;

  @override
  String toString() {
    return 'CallModel(id: $id, chatId: $chatId, type: $type, status: $status, initiatorId: $initiatorId, initiatorName: $initiatorName, initiatorAvatarUrl: $initiatorAvatarUrl, participants: $participants, startedAt: $startedAt, endedAt: $endedAt, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CallModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.chatId, chatId) || other.chatId == chatId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.initiatorId, initiatorId) ||
                other.initiatorId == initiatorId) &&
            (identical(other.initiatorName, initiatorName) ||
                other.initiatorName == initiatorName) &&
            (identical(other.initiatorAvatarUrl, initiatorAvatarUrl) ||
                other.initiatorAvatarUrl == initiatorAvatarUrl) &&
            const DeepCollectionEquality()
                .equals(other._participants, _participants) &&
            (identical(other.startedAt, startedAt) ||
                other.startedAt == startedAt) &&
            (identical(other.endedAt, endedAt) || other.endedAt == endedAt) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      chatId,
      type,
      status,
      initiatorId,
      initiatorName,
      initiatorAvatarUrl,
      const DeepCollectionEquality().hash(_participants),
      startedAt,
      endedAt,
      createdAt);

  /// Create a copy of CallModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CallModelImplCopyWith<_$CallModelImpl> get copyWith =>
      __$$CallModelImplCopyWithImpl<_$CallModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CallModelImplToJson(
      this,
    );
  }
}

abstract class _CallModel implements CallModel {
  const factory _CallModel(
      {required final String id,
      required final String chatId,
      final String type,
      final String status,
      required final String initiatorId,
      final String? initiatorName,
      final String? initiatorAvatarUrl,
      final List<CallParticipantModel> participants,
      final String? startedAt,
      final String? endedAt,
      final String? createdAt}) = _$CallModelImpl;

  factory _CallModel.fromJson(Map<String, dynamic> json) =
      _$CallModelImpl.fromJson;

  @override
  String get id;
  @override
  String get chatId;
  @override
  String get type;
  @override
  String get status;
  @override
  String get initiatorId;
  @override
  String? get initiatorName;
  @override
  String? get initiatorAvatarUrl;
  @override
  List<CallParticipantModel> get participants;
  @override
  String? get startedAt;
  @override
  String? get endedAt;
  @override
  String? get createdAt;

  /// Create a copy of CallModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CallModelImplCopyWith<_$CallModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CallParticipantModel _$CallParticipantModelFromJson(Map<String, dynamic> json) {
  return _CallParticipantModel.fromJson(json);
}

/// @nodoc
mixin _$CallParticipantModel {
  String get userId => throw _privateConstructorUsedError;
  String get displayName => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  String? get joinedAt => throw _privateConstructorUsedError;
  bool get isMuted => throw _privateConstructorUsedError;
  bool get isVideoOff => throw _privateConstructorUsedError;

  /// Serializes this CallParticipantModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CallParticipantModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CallParticipantModelCopyWith<CallParticipantModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CallParticipantModelCopyWith<$Res> {
  factory $CallParticipantModelCopyWith(CallParticipantModel value,
          $Res Function(CallParticipantModel) then) =
      _$CallParticipantModelCopyWithImpl<$Res, CallParticipantModel>;
  @useResult
  $Res call(
      {String userId,
      String displayName,
      String? avatarUrl,
      String? joinedAt,
      bool isMuted,
      bool isVideoOff});
}

/// @nodoc
class _$CallParticipantModelCopyWithImpl<$Res,
        $Val extends CallParticipantModel>
    implements $CallParticipantModelCopyWith<$Res> {
  _$CallParticipantModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CallParticipantModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? userId = null,
    Object? displayName = null,
    Object? avatarUrl = freezed,
    Object? joinedAt = freezed,
    Object? isMuted = null,
    Object? isVideoOff = null,
  }) {
    return _then(_value.copyWith(
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      displayName: null == displayName
          ? _value.displayName
          : displayName // ignore: cast_nullable_to_non_nullable
              as String,
      avatarUrl: freezed == avatarUrl
          ? _value.avatarUrl
          : avatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      joinedAt: freezed == joinedAt
          ? _value.joinedAt
          : joinedAt // ignore: cast_nullable_to_non_nullable
              as String?,
      isMuted: null == isMuted
          ? _value.isMuted
          : isMuted // ignore: cast_nullable_to_non_nullable
              as bool,
      isVideoOff: null == isVideoOff
          ? _value.isVideoOff
          : isVideoOff // ignore: cast_nullable_to_non_nullable
              as bool,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CallParticipantModelImplCopyWith<$Res>
    implements $CallParticipantModelCopyWith<$Res> {
  factory _$$CallParticipantModelImplCopyWith(_$CallParticipantModelImpl value,
          $Res Function(_$CallParticipantModelImpl) then) =
      __$$CallParticipantModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String userId,
      String displayName,
      String? avatarUrl,
      String? joinedAt,
      bool isMuted,
      bool isVideoOff});
}

/// @nodoc
class __$$CallParticipantModelImplCopyWithImpl<$Res>
    extends _$CallParticipantModelCopyWithImpl<$Res, _$CallParticipantModelImpl>
    implements _$$CallParticipantModelImplCopyWith<$Res> {
  __$$CallParticipantModelImplCopyWithImpl(_$CallParticipantModelImpl _value,
      $Res Function(_$CallParticipantModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CallParticipantModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? userId = null,
    Object? displayName = null,
    Object? avatarUrl = freezed,
    Object? joinedAt = freezed,
    Object? isMuted = null,
    Object? isVideoOff = null,
  }) {
    return _then(_$CallParticipantModelImpl(
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      displayName: null == displayName
          ? _value.displayName
          : displayName // ignore: cast_nullable_to_non_nullable
              as String,
      avatarUrl: freezed == avatarUrl
          ? _value.avatarUrl
          : avatarUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      joinedAt: freezed == joinedAt
          ? _value.joinedAt
          : joinedAt // ignore: cast_nullable_to_non_nullable
              as String?,
      isMuted: null == isMuted
          ? _value.isMuted
          : isMuted // ignore: cast_nullable_to_non_nullable
              as bool,
      isVideoOff: null == isVideoOff
          ? _value.isVideoOff
          : isVideoOff // ignore: cast_nullable_to_non_nullable
              as bool,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CallParticipantModelImpl implements _CallParticipantModel {
  const _$CallParticipantModelImpl(
      {required this.userId,
      required this.displayName,
      this.avatarUrl,
      this.joinedAt,
      this.isMuted = false,
      this.isVideoOff = false});

  factory _$CallParticipantModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CallParticipantModelImplFromJson(json);

  @override
  final String userId;
  @override
  final String displayName;
  @override
  final String? avatarUrl;
  @override
  final String? joinedAt;
  @override
  @JsonKey()
  final bool isMuted;
  @override
  @JsonKey()
  final bool isVideoOff;

  @override
  String toString() {
    return 'CallParticipantModel(userId: $userId, displayName: $displayName, avatarUrl: $avatarUrl, joinedAt: $joinedAt, isMuted: $isMuted, isVideoOff: $isVideoOff)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CallParticipantModelImpl &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.displayName, displayName) ||
                other.displayName == displayName) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.joinedAt, joinedAt) ||
                other.joinedAt == joinedAt) &&
            (identical(other.isMuted, isMuted) || other.isMuted == isMuted) &&
            (identical(other.isVideoOff, isVideoOff) ||
                other.isVideoOff == isVideoOff));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, userId, displayName, avatarUrl,
      joinedAt, isMuted, isVideoOff);

  /// Create a copy of CallParticipantModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CallParticipantModelImplCopyWith<_$CallParticipantModelImpl>
      get copyWith =>
          __$$CallParticipantModelImplCopyWithImpl<_$CallParticipantModelImpl>(
              this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CallParticipantModelImplToJson(
      this,
    );
  }
}

abstract class _CallParticipantModel implements CallParticipantModel {
  const factory _CallParticipantModel(
      {required final String userId,
      required final String displayName,
      final String? avatarUrl,
      final String? joinedAt,
      final bool isMuted,
      final bool isVideoOff}) = _$CallParticipantModelImpl;

  factory _CallParticipantModel.fromJson(Map<String, dynamic> json) =
      _$CallParticipantModelImpl.fromJson;

  @override
  String get userId;
  @override
  String get displayName;
  @override
  String? get avatarUrl;
  @override
  String? get joinedAt;
  @override
  bool get isMuted;
  @override
  bool get isVideoOff;

  /// Create a copy of CallParticipantModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CallParticipantModelImplCopyWith<_$CallParticipantModelImpl>
      get copyWith => throw _privateConstructorUsedError;
}
