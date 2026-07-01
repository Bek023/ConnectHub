import 'package:freezed_annotation/freezed_annotation.dart';

part 'message_model.freezed.dart';
part 'message_model.g.dart';

@freezed
class MessageModel with _$MessageModel {
  const factory MessageModel({
    required String id,
    required String chatType,
    required String chatId,
    required String content,
    @Default('text') String type,
    String? mediaUrl,
    required String senderId,
    required String senderName,
    String? senderAvatarUrl,
    @Default([]) List<ReactionModel> reactions,
    String? replyTo,
    @Default(false) bool isRead,
    required String createdAt,
    String? updatedAt,
  }) = _MessageModel;

  factory MessageModel.fromJson(Map<String, dynamic> json) =>
      _$MessageModelFromJson(json);
}

@freezed
class ReactionModel with _$ReactionModel {
  const factory ReactionModel({
    required String emoji,
    required String userId,
    String? userName,
  }) = _ReactionModel;

  factory ReactionModel.fromJson(Map<String, dynamic> json) =>
      _$ReactionModelFromJson(json);
}
