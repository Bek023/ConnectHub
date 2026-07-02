import 'package:freezed_annotation/freezed_annotation.dart';

part 'goal_model.freezed.dart';
part 'goal_model.g.dart';

@freezed
class GoalModel with _$GoalModel {
  const factory GoalModel({
    required String id,
    required String title,
    String? description,
    required String category,
    String? imageUrl,
    @Default(0) int membersCount,
    @Default(0) int postsCount,
    @Default(false) bool isJoined,
    required String creatorId,
    String? creatorName,
    required String createdAt,
  }) = _GoalModel;

  factory GoalModel.fromJson(Map<String, dynamic> json) =>
      _$GoalModelFromJson(json);

  factory GoalModel.fromApi(Map<String, dynamic> json) {
    return GoalModel.fromJson({
      ...json,
      'imageUrl': json['icon'] ?? json['imageUrl'],
      'membersCount': json['memberCount'] ?? json['membersCount'] ?? 0,
      'creatorId': json['creatorId'] ?? '',
    });
  }
}
