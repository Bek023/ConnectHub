// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'call_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CallModelImpl _$$CallModelImplFromJson(Map<String, dynamic> json) =>
    _$CallModelImpl(
      id: json['id'] as String,
      chatId: json['chatId'] as String,
      type: json['type'] as String? ?? 'audio',
      status: json['status'] as String? ?? 'pending',
      initiatorId: json['initiatorId'] as String,
      initiatorName: json['initiatorName'] as String?,
      initiatorAvatarUrl: json['initiatorAvatarUrl'] as String?,
      participants: (json['participants'] as List<dynamic>?)
              ?.map((e) =>
                  CallParticipantModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      startedAt: json['startedAt'] as String?,
      endedAt: json['endedAt'] as String?,
      createdAt: json['createdAt'] as String?,
    );

Map<String, dynamic> _$$CallModelImplToJson(_$CallModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'chatId': instance.chatId,
      'type': instance.type,
      'status': instance.status,
      'initiatorId': instance.initiatorId,
      'initiatorName': instance.initiatorName,
      'initiatorAvatarUrl': instance.initiatorAvatarUrl,
      'participants': instance.participants,
      'startedAt': instance.startedAt,
      'endedAt': instance.endedAt,
      'createdAt': instance.createdAt,
    };

_$CallParticipantModelImpl _$$CallParticipantModelImplFromJson(
        Map<String, dynamic> json) =>
    _$CallParticipantModelImpl(
      userId: json['userId'] as String,
      displayName: json['displayName'] as String,
      avatarUrl: json['avatarUrl'] as String?,
      joinedAt: json['joinedAt'] as String?,
      isMuted: json['isMuted'] as bool? ?? false,
      isVideoOff: json['isVideoOff'] as bool? ?? false,
    );

Map<String, dynamic> _$$CallParticipantModelImplToJson(
        _$CallParticipantModelImpl instance) =>
    <String, dynamic>{
      'userId': instance.userId,
      'displayName': instance.displayName,
      'avatarUrl': instance.avatarUrl,
      'joinedAt': instance.joinedAt,
      'isMuted': instance.isMuted,
      'isVideoOff': instance.isVideoOff,
    };
