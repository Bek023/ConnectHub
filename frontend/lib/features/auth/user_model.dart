import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String email,
    required String displayName,
    String? username,
    String? avatarUrl,
    String? bio,
    @Default(false) bool isVerified,
    @Default(true) bool isActive,
    @Default(false) bool twoFaEnabled,
    String? createdAt,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}
