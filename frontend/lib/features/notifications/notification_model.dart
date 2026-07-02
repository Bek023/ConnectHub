import 'package:freezed_annotation/freezed_annotation.dart';

part 'notification_model.freezed.dart';
part 'notification_model.g.dart';

@freezed
class NotificationModel with _$NotificationModel {
  const factory NotificationModel({
    required String id,
    required String type,
    required String title,
    required String body,
    @Default({}) Map<String, dynamic> data,
    @Default(false) bool isRead,
    String? senderAvatarUrl,
    String? senderName,
    required String createdAt,
  }) = _NotificationModel;

  factory NotificationModel.fromJson(Map<String, dynamic> json) =>
      _$NotificationModelFromJson(json);

  factory NotificationModel.fromApi(Map<String, dynamic> json) {
    return NotificationModel.fromJson({
      ...json,
      'body': json['body'] ?? '',
      'data': json['data'] ?? const <String, dynamic>{},
    });
  }
}
