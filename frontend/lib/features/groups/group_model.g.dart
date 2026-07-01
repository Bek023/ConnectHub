// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'group_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GroupModelImpl _$$GroupModelImplFromJson(Map<String, dynamic> json) =>
    _$GroupModelImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      coverUrl: json['coverUrl'] as String?,
      type: json['type'] as String? ?? 'public',
      membersCount: (json['membersCount'] as num?)?.toInt() ?? 0,
      isJoined: json['isJoined'] as bool? ?? false,
      inviteCode: json['inviteCode'] as String?,
      myRole: json['myRole'] as String?,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$$GroupModelImplToJson(_$GroupModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'avatarUrl': instance.avatarUrl,
      'coverUrl': instance.coverUrl,
      'type': instance.type,
      'membersCount': instance.membersCount,
      'isJoined': instance.isJoined,
      'inviteCode': instance.inviteCode,
      'myRole': instance.myRole,
      'createdAt': instance.createdAt,
    };

_$GroupMemberModelImpl _$$GroupMemberModelImplFromJson(
        Map<String, dynamic> json) =>
    _$GroupMemberModelImpl(
      id: json['id'] as String,
      displayName: json['displayName'] as String,
      username: json['username'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      role: json['role'] as String? ?? 'member',
      joinedAt: json['joinedAt'] as String,
    );

Map<String, dynamic> _$$GroupMemberModelImplToJson(
        _$GroupMemberModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'displayName': instance.displayName,
      'username': instance.username,
      'avatarUrl': instance.avatarUrl,
      'role': instance.role,
      'joinedAt': instance.joinedAt,
    };
