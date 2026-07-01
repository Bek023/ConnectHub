// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$NotificationModelImpl _$$NotificationModelImplFromJson(
        Map<String, dynamic> json) =>
    _$NotificationModelImpl(
      id: json['id'] as String,
      type: json['type'] as String,
      title: json['title'] as String,
      body: json['body'] as String,
      data: json['data'] as Map<String, dynamic>? ?? const {},
      isRead: json['isRead'] as bool? ?? false,
      senderAvatarUrl: json['senderAvatarUrl'] as String?,
      senderName: json['senderName'] as String?,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$$NotificationModelImplToJson(
        _$NotificationModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'title': instance.title,
      'body': instance.body,
      'data': instance.data,
      'isRead': instance.isRead,
      'senderAvatarUrl': instance.senderAvatarUrl,
      'senderName': instance.senderName,
      'createdAt': instance.createdAt,
    };
