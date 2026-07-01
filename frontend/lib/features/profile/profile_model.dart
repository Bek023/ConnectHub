import 'package:freezed_annotation/freezed_annotation.dart';

part 'profile_model.freezed.dart';
part 'profile_model.g.dart';

@freezed
class ProfileModel with _$ProfileModel {
  const factory ProfileModel({
    required String id,
    required String email,
    required String displayName,
    String? username,
    String? avatarUrl,
    String? bio,
    @Default(false) bool isVerified,
    @Default(false) bool twoFaEnabled,
    @Default(0) int postsCount,
    @Default(0) int goalsCount,
    @Default(0) int groupsCount,
    @Default(false) bool isFollowing,
    String? createdAt,
  }) = _ProfileModel;

  factory ProfileModel.fromJson(Map<String, dynamic> json) =>
      _$ProfileModelFromJson(json);
}
