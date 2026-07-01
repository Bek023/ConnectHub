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
}
