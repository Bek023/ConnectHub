// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MessageModelImpl _$$MessageModelImplFromJson(Map<String, dynamic> json) =>
    _$MessageModelImpl(
      id: json['id'] as String,
      chatType: json['chatType'] as String,
      chatId: json['chatId'] as String,
      content: json['content'] as String,
      type: json['type'] as String? ?? 'text',
      mediaUrl: json['mediaUrl'] as String?,
      senderId: json['senderId'] as String,
      senderName: json['senderName'] as String,
      senderAvatarUrl: json['senderAvatarUrl'] as String?,
      reactions: (json['reactions'] as List<dynamic>?)
              ?.map((e) => ReactionModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      replyTo: json['replyTo'] as String?,
      isRead: json['isRead'] as bool? ?? false,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String?,
    );

Map<String, dynamic> _$$MessageModelImplToJson(_$MessageModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'chatType': instance.chatType,
      'chatId': instance.chatId,
      'content': instance.content,
      'type': instance.type,
      'mediaUrl': instance.mediaUrl,
      'senderId': instance.senderId,
      'senderName': instance.senderName,
      'senderAvatarUrl': instance.senderAvatarUrl,
      'reactions': instance.reactions,
      'replyTo': instance.replyTo,
      'isRead': instance.isRead,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };

_$ReactionModelImpl _$$ReactionModelImplFromJson(Map<String, dynamic> json) =>
    _$ReactionModelImpl(
      emoji: json['emoji'] as String,
      userId: json['userId'] as String,
      userName: json['userName'] as String?,
    );

Map<String, dynamic> _$$ReactionModelImplToJson(_$ReactionModelImpl instance) =>
    <String, dynamic>{
      'emoji': instance.emoji,
      'userId': instance.userId,
      'userName': instance.userName,
    };
