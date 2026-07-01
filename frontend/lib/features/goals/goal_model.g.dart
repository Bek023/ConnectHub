// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'goal_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$GoalModelImpl _$$GoalModelImplFromJson(Map<String, dynamic> json) =>
    _$GoalModelImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      category: json['category'] as String,
      imageUrl: json['imageUrl'] as String?,
      membersCount: (json['membersCount'] as num?)?.toInt() ?? 0,
      postsCount: (json['postsCount'] as num?)?.toInt() ?? 0,
      isJoined: json['isJoined'] as bool? ?? false,
      creatorId: json['creatorId'] as String,
      creatorName: json['creatorName'] as String?,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$$GoalModelImplToJson(_$GoalModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'description': instance.description,
      'category': instance.category,
      'imageUrl': instance.imageUrl,
      'membersCount': instance.membersCount,
      'postsCount': instance.postsCount,
      'isJoined': instance.isJoined,
      'creatorId': instance.creatorId,
      'creatorName': instance.creatorName,
      'createdAt': instance.createdAt,
    };
