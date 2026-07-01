import 'package:freezed_annotation/freezed_annotation.dart';

part 'group_model.freezed.dart';
part 'group_model.g.dart';

@freezed
class GroupModel with _$GroupModel {
  const factory GroupModel({
    required String id,
    required String title,
    String? description,
    String? avatarUrl,
    String? coverUrl,
    @Default('public') String type,
    @Default(0) int membersCount,
    @Default(false) bool isJoined,
    String? inviteCode,
    String? myRole,
    required String createdAt,
  }) = _GroupModel;

  factory GroupModel.fromJson(Map<String, dynamic> json) =>
      _$GroupModelFromJson(json);
}

@freezed
class GroupMemberModel with _$GroupMemberModel {
  const factory GroupMemberModel({
    required String id,
    required String displayName,
    String? username,
    String? avatarUrl,
    @Default('member') String role,
    required String joinedAt,
  }) = _GroupMemberModel;

  factory GroupMemberModel.fromJson(Map<String, dynamic> json) =>
      _$GroupMemberModelFromJson(json);
}
