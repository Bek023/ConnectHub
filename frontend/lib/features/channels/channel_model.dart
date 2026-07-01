import 'package:freezed_annotation/freezed_annotation.dart';

part 'channel_model.freezed.dart';
part 'channel_model.g.dart';

@freezed
class ChannelModel with _$ChannelModel {
  const factory ChannelModel({
    required String id,
    required String name,
    String? description,
    String? avatarUrl,
    String? coverUrl,
    String? category,
    @Default(0) int subscribersCount,
    @Default(0) int postsCount,
    @Default(false) bool isSubscribed,
    @Default(false) bool isOwner,
    required String ownerId,
    String? ownerName,
    required String createdAt,
  }) = _ChannelModel;

  factory ChannelModel.fromJson(Map<String, dynamic> json) =>
      _$ChannelModelFromJson(json);
}

@freezed
class ChannelStatsModel with _$ChannelStatsModel {
  const factory ChannelStatsModel({
    @Default(0) int totalSubscribers,
    @Default(0) int totalPosts,
    @Default(0) int totalViews,
    @Default(0) int newSubscribersToday,
    @Default(0) int postsThisWeek,
  }) = _ChannelStatsModel;

  factory ChannelStatsModel.fromJson(Map<String, dynamic> json) =>
      _$ChannelStatsModelFromJson(json);
}
