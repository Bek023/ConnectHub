// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'post_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PostAuthorModelImpl _$$PostAuthorModelImplFromJson(
        Map<String, dynamic> json) =>
    _$PostAuthorModelImpl(
      id: json['id'] as String,
      displayName: json['displayName'] as String,
      username: json['username'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      isVerified: json['isVerified'] as bool? ?? false,
    );

Map<String, dynamic> _$$PostAuthorModelImplToJson(
        _$PostAuthorModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'displayName': instance.displayName,
      'username': instance.username,
      'avatarUrl': instance.avatarUrl,
      'isVerified': instance.isVerified,
    };

_$PostModelImpl _$$PostModelImplFromJson(Map<String, dynamic> json) =>
    _$PostModelImpl(
      id: json['id'] as String,
      author: PostAuthorModel.fromJson(json['author'] as Map<String, dynamic>),
      content: json['content'] as String,
      mediaUrls: (json['mediaUrls'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      likesCount: (json['likesCount'] as num?)?.toInt() ?? 0,
      commentsCount: (json['commentsCount'] as num?)?.toInt() ?? 0,
      isLiked: json['isLiked'] as bool? ?? false,
      isPinned: json['isPinned'] as bool? ?? false,
      groupId: json['groupId'] as String?,
      channelId: json['channelId'] as String?,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$$PostModelImplToJson(_$PostModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'author': instance.author,
      'content': instance.content,
      'mediaUrls': instance.mediaUrls,
      'likesCount': instance.likesCount,
      'commentsCount': instance.commentsCount,
      'isLiked': instance.isLiked,
      'isPinned': instance.isPinned,
      'groupId': instance.groupId,
      'channelId': instance.channelId,
      'createdAt': instance.createdAt,
    };
