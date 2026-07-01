import 'package:freezed_annotation/freezed_annotation.dart';

part 'call_model.freezed.dart';
part 'call_model.g.dart';

@freezed
class CallModel with _$CallModel {
  const factory CallModel({
    required String id,
    required String chatId,
    @Default('audio') String type,
    @Default('pending') String status,
    required String initiatorId,
    String? initiatorName,
    String? initiatorAvatarUrl,
    @Default([]) List<CallParticipantModel> participants,
    String? startedAt,
    String? endedAt,
    String? createdAt,
  }) = _CallModel;

  factory CallModel.fromJson(Map<String, dynamic> json) =>
      _$CallModelFromJson(json);
}

@freezed
class CallParticipantModel with _$CallParticipantModel {
  const factory CallParticipantModel({
    required String userId,
    required String displayName,
    String? avatarUrl,
    String? joinedAt,
    @Default(false) bool isMuted,
    @Default(false) bool isVideoOff,
  }) = _CallParticipantModel;

  factory CallParticipantModel.fromJson(Map<String, dynamic> json) =>
      _$CallParticipantModelFromJson(json);
}
