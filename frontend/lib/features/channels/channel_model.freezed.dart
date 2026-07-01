// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'channel_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ChannelModel _$ChannelModelFromJson(Map<String, dynamic> json) {
  return _ChannelModel.fromJson(json);
}

/// @nodoc
mixin _$ChannelModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  String? get coverUrl => throw _privateConstructorUsedError;
  String? get category => throw _privateConstructorUsedError;
  int get subscribersCount => throw _privateConstructorUsedError;
  int get postsCount => throw _privateConstructorUsedError;
  bool get isSubscribed => throw _privateConstructorUsedError;
  bool get isOwner => throw _privateConstructorUsedError;
  String get ownerId => throw _privateConstructorUsedError;
  String? get ownerName => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;

  /// Serializes this ChannelModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ChannelModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ChannelModelCopyWith<ChannelModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChannelModelCopyWith<$Res> {
  factory $ChannelModelCopyWith(
          ChannelModel value, $Res Function(ChannelModel) then) =
      _$ChannelModelCopyWithImpl<$Res, ChannelModel>;
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      String? avatarUrl,
      String? coverUrl,
      String? category,
      int subscribersCount,
      int postsCount,
      bool isSubscribed,
      bool isOwner,
      String ownerId,
      String? ownerName,
      String createdAt});
}

/// @nodoc
class _$ChannelModelCopyWithImpl<$Res, $Val extends ChannelModel>
    implements $ChannelModelCopyWith<$Res> {
  _$ChannelModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ChannelModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? avatarUrl = freezed,
    Object? coverUrl = freezed,
    Object? category = freezed,
    Object? subscribersCount = null,
    Object? postsCount = null,
    Object? isSubscribed = null,
    Object? isOwner = null,
    Object? ownerId = null,
    Object? ownerName = freezed,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
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
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as String?,
      subscribersCount: null == subscribersCount
          ? _value.subscribersCount
          : subscribersCount // ignore: cast_nullable_to_non_nullable
              as int,
      postsCount: null == postsCount
          ? _value.postsCount
          : postsCount // ignore: cast_nullable_to_non_nullable
              as int,
      isSubscribed: null == isSubscribed
          ? _value.isSubscribed
          : isSubscribed // ignore: cast_nullable_to_non_nullable
              as bool,
      isOwner: null == isOwner
          ? _value.isOwner
          : isOwner // ignore: cast_nullable_to_non_nullable
              as bool,
      ownerId: null == ownerId
          ? _value.ownerId
          : ownerId // ignore: cast_nullable_to_non_nullable
              as String,
      ownerName: freezed == ownerName
          ? _value.ownerName
          : ownerName // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ChannelModelImplCopyWith<$Res>
    implements $ChannelModelCopyWith<$Res> {
  factory _$$ChannelModelImplCopyWith(
          _$ChannelModelImpl value, $Res Function(_$ChannelModelImpl) then) =
      __$$ChannelModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String? description,
      String? avatarUrl,
      String? coverUrl,
      String? category,
      int subscribersCount,
      int postsCount,
      bool isSubscribed,
      bool isOwner,
      String ownerId,
      String? ownerName,
      String createdAt});
}

/// @nodoc
class __$$ChannelModelImplCopyWithImpl<$Res>
    extends _$ChannelModelCopyWithImpl<$Res, _$ChannelModelImpl>
    implements _$$ChannelModelImplCopyWith<$Res> {
  __$$ChannelModelImplCopyWithImpl(
      _$ChannelModelImpl _value, $Res Function(_$ChannelModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ChannelModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? avatarUrl = freezed,
    Object? coverUrl = freezed,
    Object? category = freezed,
    Object? subscribersCount = null,
    Object? postsCount = null,
    Object? isSubscribed = null,
    Object? isOwner = null,
    Object? ownerId = null,
    Object? ownerName = freezed,
    Object? createdAt = null,
  }) {
    return _then(_$ChannelModelImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
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
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as String?,
      subscribersCount: null == subscribersCount
          ? _value.subscribersCount
          : subscribersCount // ignore: cast_nullable_to_non_nullable
              as int,
      postsCount: null == postsCount
          ? _value.postsCount
          : postsCount // ignore: cast_nullable_to_non_nullable
              as int,
      isSubscribed: null == isSubscribed
          ? _value.isSubscribed
          : isSubscribed // ignore: cast_nullable_to_non_nullable
              as bool,
      isOwner: null == isOwner
          ? _value.isOwner
          : isOwner // ignore: cast_nullable_to_non_nullable
              as bool,
      ownerId: null == ownerId
          ? _value.ownerId
          : ownerId // ignore: cast_nullable_to_non_nullable
              as String,
      ownerName: freezed == ownerName
          ? _value.ownerName
          : ownerName // ignore: cast_nullable_to_non_nullable
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
class _$ChannelModelImpl implements _ChannelModel {
  const _$ChannelModelImpl(
      {required this.id,
      required this.name,
      this.description,
      this.avatarUrl,
      this.coverUrl,
      this.category,
      this.subscribersCount = 0,
      this.postsCount = 0,
      this.isSubscribed = false,
      this.isOwner = false,
      required this.ownerId,
      this.ownerName,
      required this.createdAt});

  factory _$ChannelModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChannelModelImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? description;
  @override
  final String? avatarUrl;
  @override
  final String? coverUrl;
  @override
  final String? category;
  @override
  @JsonKey()
  final int subscribersCount;
  @override
  @JsonKey()
  final int postsCount;
  @override
  @JsonKey()
  final bool isSubscribed;
  @override
  @JsonKey()
  final bool isOwner;
  @override
  final String ownerId;
  @override
  final String? ownerName;
  @override
  final String createdAt;

  @override
  String toString() {
    return 'ChannelModel(id: $id, name: $name, description: $description, avatarUrl: $avatarUrl, coverUrl: $coverUrl, category: $category, subscribersCount: $subscribersCount, postsCount: $postsCount, isSubscribed: $isSubscribed, isOwner: $isOwner, ownerId: $ownerId, ownerName: $ownerName, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChannelModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.coverUrl, coverUrl) ||
                other.coverUrl == coverUrl) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.subscribersCount, subscribersCount) ||
                other.subscribersCount == subscribersCount) &&
            (identical(other.postsCount, postsCount) ||
                other.postsCount == postsCount) &&
            (identical(other.isSubscribed, isSubscribed) ||
                other.isSubscribed == isSubscribed) &&
            (identical(other.isOwner, isOwner) || other.isOwner == isOwner) &&
            (identical(other.ownerId, ownerId) || other.ownerId == ownerId) &&
            (identical(other.ownerName, ownerName) ||
                other.ownerName == ownerName) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      name,
      description,
      avatarUrl,
      coverUrl,
      category,
      subscribersCount,
      postsCount,
      isSubscribed,
      isOwner,
      ownerId,
      ownerName,
      createdAt);

  /// Create a copy of ChannelModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ChannelModelImplCopyWith<_$ChannelModelImpl> get copyWith =>
      __$$ChannelModelImplCopyWithImpl<_$ChannelModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ChannelModelImplToJson(
      this,
    );
  }
}

abstract class _ChannelModel implements ChannelModel {
  const factory _ChannelModel(
      {required final String id,
      required final String name,
      final String? description,
      final String? avatarUrl,
      final String? coverUrl,
      final String? category,
      final int subscribersCount,
      final int postsCount,
      final bool isSubscribed,
      final bool isOwner,
      required final String ownerId,
      final String? ownerName,
      required final String createdAt}) = _$ChannelModelImpl;

  factory _ChannelModel.fromJson(Map<String, dynamic> json) =
      _$ChannelModelImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get description;
  @override
  String? get avatarUrl;
  @override
  String? get coverUrl;
  @override
  String? get category;
  @override
  int get subscribersCount;
  @override
  int get postsCount;
  @override
  bool get isSubscribed;
  @override
  bool get isOwner;
  @override
  String get ownerId;
  @override
  String? get ownerName;
  @override
  String get createdAt;

  /// Create a copy of ChannelModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ChannelModelImplCopyWith<_$ChannelModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ChannelStatsModel _$ChannelStatsModelFromJson(Map<String, dynamic> json) {
  return _ChannelStatsModel.fromJson(json);
}

/// @nodoc
mixin _$ChannelStatsModel {
  int get totalSubscribers => throw _privateConstructorUsedError;
  int get totalPosts => throw _privateConstructorUsedError;
  int get totalViews => throw _privateConstructorUsedError;
  int get newSubscribersToday => throw _privateConstructorUsedError;
  int get postsThisWeek => throw _privateConstructorUsedError;

  /// Serializes this ChannelStatsModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ChannelStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ChannelStatsModelCopyWith<ChannelStatsModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChannelStatsModelCopyWith<$Res> {
  factory $ChannelStatsModelCopyWith(
          ChannelStatsModel value, $Res Function(ChannelStatsModel) then) =
      _$ChannelStatsModelCopyWithImpl<$Res, ChannelStatsModel>;
  @useResult
  $Res call(
      {int totalSubscribers,
      int totalPosts,
      int totalViews,
      int newSubscribersToday,
      int postsThisWeek});
}

/// @nodoc
class _$ChannelStatsModelCopyWithImpl<$Res, $Val extends ChannelStatsModel>
    implements $ChannelStatsModelCopyWith<$Res> {
  _$ChannelStatsModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ChannelStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalSubscribers = null,
    Object? totalPosts = null,
    Object? totalViews = null,
    Object? newSubscribersToday = null,
    Object? postsThisWeek = null,
  }) {
    return _then(_value.copyWith(
      totalSubscribers: null == totalSubscribers
          ? _value.totalSubscribers
          : totalSubscribers // ignore: cast_nullable_to_non_nullable
              as int,
      totalPosts: null == totalPosts
          ? _value.totalPosts
          : totalPosts // ignore: cast_nullable_to_non_nullable
              as int,
      totalViews: null == totalViews
          ? _value.totalViews
          : totalViews // ignore: cast_nullable_to_non_nullable
              as int,
      newSubscribersToday: null == newSubscribersToday
          ? _value.newSubscribersToday
          : newSubscribersToday // ignore: cast_nullable_to_non_nullable
              as int,
      postsThisWeek: null == postsThisWeek
          ? _value.postsThisWeek
          : postsThisWeek // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ChannelStatsModelImplCopyWith<$Res>
    implements $ChannelStatsModelCopyWith<$Res> {
  factory _$$ChannelStatsModelImplCopyWith(_$ChannelStatsModelImpl value,
          $Res Function(_$ChannelStatsModelImpl) then) =
      __$$ChannelStatsModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int totalSubscribers,
      int totalPosts,
      int totalViews,
      int newSubscribersToday,
      int postsThisWeek});
}

/// @nodoc
class __$$ChannelStatsModelImplCopyWithImpl<$Res>
    extends _$ChannelStatsModelCopyWithImpl<$Res, _$ChannelStatsModelImpl>
    implements _$$ChannelStatsModelImplCopyWith<$Res> {
  __$$ChannelStatsModelImplCopyWithImpl(_$ChannelStatsModelImpl _value,
      $Res Function(_$ChannelStatsModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ChannelStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalSubscribers = null,
    Object? totalPosts = null,
    Object? totalViews = null,
    Object? newSubscribersToday = null,
    Object? postsThisWeek = null,
  }) {
    return _then(_$ChannelStatsModelImpl(
      totalSubscribers: null == totalSubscribers
          ? _value.totalSubscribers
          : totalSubscribers // ignore: cast_nullable_to_non_nullable
              as int,
      totalPosts: null == totalPosts
          ? _value.totalPosts
          : totalPosts // ignore: cast_nullable_to_non_nullable
              as int,
      totalViews: null == totalViews
          ? _value.totalViews
          : totalViews // ignore: cast_nullable_to_non_nullable
              as int,
      newSubscribersToday: null == newSubscribersToday
          ? _value.newSubscribersToday
          : newSubscribersToday // ignore: cast_nullable_to_non_nullable
              as int,
      postsThisWeek: null == postsThisWeek
          ? _value.postsThisWeek
          : postsThisWeek // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ChannelStatsModelImpl implements _ChannelStatsModel {
  const _$ChannelStatsModelImpl(
      {this.totalSubscribers = 0,
      this.totalPosts = 0,
      this.totalViews = 0,
      this.newSubscribersToday = 0,
      this.postsThisWeek = 0});

  factory _$ChannelStatsModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChannelStatsModelImplFromJson(json);

  @override
  @JsonKey()
  final int totalSubscribers;
  @override
  @JsonKey()
  final int totalPosts;
  @override
  @JsonKey()
  final int totalViews;
  @override
  @JsonKey()
  final int newSubscribersToday;
  @override
  @JsonKey()
  final int postsThisWeek;

  @override
  String toString() {
    return 'ChannelStatsModel(totalSubscribers: $totalSubscribers, totalPosts: $totalPosts, totalViews: $totalViews, newSubscribersToday: $newSubscribersToday, postsThisWeek: $postsThisWeek)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChannelStatsModelImpl &&
            (identical(other.totalSubscribers, totalSubscribers) ||
                other.totalSubscribers == totalSubscribers) &&
            (identical(other.totalPosts, totalPosts) ||
                other.totalPosts == totalPosts) &&
            (identical(other.totalViews, totalViews) ||
                other.totalViews == totalViews) &&
            (identical(other.newSubscribersToday, newSubscribersToday) ||
                other.newSubscribersToday == newSubscribersToday) &&
            (identical(other.postsThisWeek, postsThisWeek) ||
                other.postsThisWeek == postsThisWeek));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, totalSubscribers, totalPosts,
      totalViews, newSubscribersToday, postsThisWeek);

  /// Create a copy of ChannelStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ChannelStatsModelImplCopyWith<_$ChannelStatsModelImpl> get copyWith =>
      __$$ChannelStatsModelImplCopyWithImpl<_$ChannelStatsModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ChannelStatsModelImplToJson(
      this,
    );
  }
}

abstract class _ChannelStatsModel implements ChannelStatsModel {
  const factory _ChannelStatsModel(
      {final int totalSubscribers,
      final int totalPosts,
      final int totalViews,
      final int newSubscribersToday,
      final int postsThisWeek}) = _$ChannelStatsModelImpl;

  factory _ChannelStatsModel.fromJson(Map<String, dynamic> json) =
      _$ChannelStatsModelImpl.fromJson;

  @override
  int get totalSubscribers;
  @override
  int get totalPosts;
  @override
  int get totalViews;
  @override
  int get newSubscribersToday;
  @override
  int get postsThisWeek;

  /// Create a copy of ChannelStatsModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ChannelStatsModelImplCopyWith<_$ChannelStatsModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
