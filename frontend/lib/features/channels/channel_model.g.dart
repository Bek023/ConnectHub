// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'channel_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ChannelModelImpl _$$ChannelModelImplFromJson(Map<String, dynamic> json) =>
    _$ChannelModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      coverUrl: json['coverUrl'] as String?,
      category: json['category'] as String?,
      subscribersCount: (json['subscribersCount'] as num?)?.toInt() ?? 0,
      postsCount: (json['postsCount'] as num?)?.toInt() ?? 0,
      isSubscribed: json['isSubscribed'] as bool? ?? false,
      isOwner: json['isOwner'] as bool? ?? false,
      ownerId: json['ownerId'] as String,
      ownerName: json['ownerName'] as String?,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$$ChannelModelImplToJson(_$ChannelModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'avatarUrl': instance.avatarUrl,
      'coverUrl': instance.coverUrl,
      'category': instance.category,
      'subscribersCount': instance.subscribersCount,
      'postsCount': instance.postsCount,
      'isSubscribed': instance.isSubscribed,
      'isOwner': instance.isOwner,
      'ownerId': instance.ownerId,
      'ownerName': instance.ownerName,
      'createdAt': instance.createdAt,
    };

_$ChannelStatsModelImpl _$$ChannelStatsModelImplFromJson(
        Map<String, dynamic> json) =>
    _$ChannelStatsModelImpl(
      totalSubscribers: (json['totalSubscribers'] as num?)?.toInt() ?? 0,
      totalPosts: (json['totalPosts'] as num?)?.toInt() ?? 0,
      totalViews: (json['totalViews'] as num?)?.toInt() ?? 0,
      newSubscribersToday: (json['newSubscribersToday'] as num?)?.toInt() ?? 0,
      postsThisWeek: (json['postsThisWeek'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$ChannelStatsModelImplToJson(
        _$ChannelStatsModelImpl instance) =>
    <String, dynamic>{
      'totalSubscribers': instance.totalSubscribers,
      'totalPosts': instance.totalPosts,
      'totalViews': instance.totalViews,
      'newSubscribersToday': instance.newSubscribersToday,
      'postsThisWeek': instance.postsThisWeek,
    };
