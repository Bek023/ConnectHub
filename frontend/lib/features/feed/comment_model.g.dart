// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'comment_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CommentModelImpl _$$CommentModelImplFromJson(Map<String, dynamic> json) =>
    _$CommentModelImpl(
      id: json['id'] as String,
      author: PostAuthorModel.fromJson(json['author'] as Map<String, dynamic>),
      content: json['content'] as String,
      replyTo: json['replyTo'] as String?,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$$CommentModelImplToJson(_$CommentModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'author': instance.author,
      'content': instance.content,
      'replyTo': instance.replyTo,
      'createdAt': instance.createdAt,
    };
