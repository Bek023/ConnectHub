import 'package:freezed_annotation/freezed_annotation.dart';

import 'post_model.dart';

part 'comment_model.freezed.dart';
part 'comment_model.g.dart';

@freezed
class CommentModel with _$CommentModel {
  const factory CommentModel({
    required String id,
    required PostAuthorModel author,
    required String content,
    String? replyTo,
    required String createdAt,
  }) = _CommentModel;

  factory CommentModel.fromJson(Map<String, dynamic> json) =>
      _$CommentModelFromJson(json);

  factory CommentModel.fromApi(Map<String, dynamic> json) {
    final replyTo = json['replyToId'] ?? json['replyTo'];
    return CommentModel.fromJson({
      ...json,
      'content': json['content'] ?? '',
      'replyTo': replyTo is Map ? replyTo['id'] : replyTo,
    });
  }
}
