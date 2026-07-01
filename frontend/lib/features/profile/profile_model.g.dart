// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'profile_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProfileModelImpl _$$ProfileModelImplFromJson(Map<String, dynamic> json) =>
    _$ProfileModelImpl(
      id: json['id'] as String,
      email: json['email'] as String,
      displayName: json['displayName'] as String,
      username: json['username'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      bio: json['bio'] as String?,
      isVerified: json['isVerified'] as bool? ?? false,
      twoFaEnabled: json['twoFaEnabled'] as bool? ?? false,
      postsCount: (json['postsCount'] as num?)?.toInt() ?? 0,
      goalsCount: (json['goalsCount'] as num?)?.toInt() ?? 0,
      groupsCount: (json['groupsCount'] as num?)?.toInt() ?? 0,
      isFollowing: json['isFollowing'] as bool? ?? false,
      createdAt: json['createdAt'] as String?,
    );

Map<String, dynamic> _$$ProfileModelImplToJson(_$ProfileModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'displayName': instance.displayName,
      'username': instance.username,
      'avatarUrl': instance.avatarUrl,
      'bio': instance.bio,
      'isVerified': instance.isVerified,
      'twoFaEnabled': instance.twoFaEnabled,
      'postsCount': instance.postsCount,
      'goalsCount': instance.goalsCount,
      'groupsCount': instance.groupsCount,
      'isFollowing': instance.isFollowing,
      'createdAt': instance.createdAt,
    };
