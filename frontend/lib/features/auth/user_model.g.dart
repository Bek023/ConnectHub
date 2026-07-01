// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserModelImpl _$$UserModelImplFromJson(Map<String, dynamic> json) =>
    _$UserModelImpl(
      id: json['id'] as String,
      email: json['email'] as String,
      displayName: json['displayName'] as String,
      username: json['username'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      bio: json['bio'] as String?,
      isVerified: json['isVerified'] as bool? ?? false,
      isActive: json['isActive'] as bool? ?? true,
      twoFaEnabled: json['twoFaEnabled'] as bool? ?? false,
      createdAt: json['createdAt'] as String?,
    );

Map<String, dynamic> _$$UserModelImplToJson(_$UserModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'displayName': instance.displayName,
      'username': instance.username,
      'avatarUrl': instance.avatarUrl,
      'bio': instance.bio,
      'isVerified': instance.isVerified,
      'isActive': instance.isActive,
      'twoFaEnabled': instance.twoFaEnabled,
      'createdAt': instance.createdAt,
    };
