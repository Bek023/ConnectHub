import 'package:freezed_annotation/freezed_annotation.dart';

part 'post_model.freezed.dart';
part 'post_model.g.dart';

@freezed
class PostAuthorModel with _$PostAuthorModel {
  const factory PostAuthorModel({
    required String id,
    required String displayName,
    String? username,
    String? avatarUrl,
    @Default(false) bool isVerified,
  }) = _PostAuthorModel;

  factory PostAuthorModel.fromJson(Map<String, dynamic> json) =>
      _$PostAuthorModelFromJson(json);
}

@freezed
class PostModel with _$PostModel {
  const factory PostModel({
    required String id,
    required PostAuthorModel author,
    required String content,
    @Default([]) List<String> mediaUrls,
    @Default(0) int likesCount,
    @Default(0) int commentsCount,
    @Default(false) bool isLiked,
    @Default(false) bool isPinned,
    String? groupId,
    String? channelId,
    required String createdAt,
  }) = _PostModel;

  factory PostModel.fromJson(Map<String, dynamic> json) =>
      _$PostModelFromJson(json);

  factory PostModel.fromApi(Map<String, dynamic> json) {
    final chatType = json['chatType'] as String?;
    final chatId = json['chatId'] as String?;
    return PostModel.fromJson({
      ...json,
      'content': json['content'] ?? '',
      'likesCount': json['likeCount'] ?? json['likesCount'] ?? 0,
      'commentsCount': json['commentCount'] ?? json['commentsCount'] ?? 0,
      'isLiked': json['isLiked'] ?? false,
      'groupId': chatType == 'group' ? chatId : json['groupId'],
      'channelId': chatType == 'channel' ? chatId : json['channelId'],
    });
  }
}
